import { Observable, Observer, of, Subject, throwError } from 'rxjs';
import { concat, map, mergeMap, multicast, refCount, take } from 'rxjs/operators';
import { TestScheduler } from 'rxjs/testing';
import { retryBackoff, intervalBackoff } from './shared-rxjs-backoff';

/** @test {interval} */
describe('interval', () => {
  let testScheduler: TestScheduler;

  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  it('should emit sequence starting from 0 with exponentially increasing delay', () => {
    testScheduler.run(({ expectObservable }) => {
      const expected = '01-2---3-------4---------------(5|)';
      expectObservable(intervalBackoff(1, testScheduler).pipe(take(6))).toBe(expected, [0, 1, 2, 3, 4, 5]);
    });
  });

  it('should emit when relative interval set to zero', () => {
    testScheduler.run(({ expectObservable }) => {
      const expected = '(012345|)';
      expectObservable(intervalBackoff(0, testScheduler).pipe(take(6))).toBe(expected, [0, 1, 2, 3, 4, 5]);
    });
  });

  it('should consider negative interval as zero', () => {
    testScheduler.run(({ expectObservable }) => {
      const expected = '(012345|)';
      expectObservable(intervalBackoff(-1, testScheduler).pipe(take(6))).toBe(expected, [0, 1, 2, 3, 4, 5]);
    });
  });

  it('should emit values until unsubscribed', (done) => {
    const values: number[] = [];
    const expected = [0, 1, 2, 3, 4, 5, 6];
    const e1 = intervalBackoff(2);
    const subscription = e1.subscribe(
      (x: number) => {
        values.push(x);
        if (x === 6) {
          subscription.unsubscribe();
          expect(values).toEqual(expected);
          done();
        }
      },
      (err: any) => {
        done(new Error('should not be called'));
      },
      () => {
        done(new Error('should not be called'));
      },
    );
  });

  it('should backoff until maxInterval', () => {
    testScheduler.run(({ expectObservable }) => {
      //        6 frames between 👇 and 👇
      const expected = '01-2---3-----4-----(5|)';
      expectObservable(
        intervalBackoff(
          {
            initialInterval: 1,
            maxInterval: 6,
          },
          testScheduler,
        ).pipe(take(6)),
      ).toBe(expected, [0, 1, 2, 3, 4, 5]);
    });
  });
});
describe('retryBackoff operator', () => {
  let testScheduler: TestScheduler;

  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  it('should handle a basic source that emits next then errors, maxRetries 3', () => {
    testScheduler.run(({ expectObservable, cold, expectSubscriptions }) => {
      const source = cold('--1-2-3-#');
      const subs = [
        '                  ^-------!',
        '                  ---------^-------!',
        '                  -------------------^-------!',
        '                  -------------------------------^-------!',
      ];
      const expected = '   --1-2-3----1-2-3-----1-2-3-------1-2-3-#';

      expectObservable(
        source.pipe(
          retryBackoff({
            initialInterval: 1,
            maxRetries: 3,
          }),
        ),
      ).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(subs);
    });
  });

  it('should retry a number of times, without error, then complete', (done) => {
    let errors = 0;
    const retries = 2;
    Observable.create((observer: Observer<number>) => {
      observer.next(42);
      observer.complete();
    })
      .pipe(
        map((x: any) => {
          if (++errors < retries) {
            throw 'bad';
          }
          errors = 0;
          return x;
        }),
        retryBackoff({ initialInterval: 1, maxRetries: retries }),
      )
      .subscribe(
        (x: number) => {
          expect(x).toEqual(42);
        },
        (err: any) => {
          expect('this was called').toBeTruthy();
        },
        done,
      );
  });

  it('should retry a number of times, then call error handler', (done) => {
    let errors = 0;
    const retries = 2;
    Observable.create((observer: Observer<number>) => {
      observer.next(42);
      observer.complete();
    })
      .pipe(
        map((x: any) => {
          errors += 1;
          throw 'bad';
        }),
        retryBackoff({ initialInterval: 1, maxRetries: retries - 1 }),
      )
      .subscribe(
        (x: number) => {
          expect(x).toEqual(42);
        },
        (err: any) => {
          expect(errors).toEqual(2);
          done();
        },
        () => {
          expect('this was called').toBeTruthy();
        },
      );
  });

  it('should retry until successful completion', (done) => {
    let errors = 0;
    const retries = 10;
    Observable.create((observer: Observer<number>) => {
      observer.next(42);
      observer.complete();
    })
      .pipe(
        map((x: any) => {
          if (++errors < retries) {
            throw 'bad';
          }
          errors = 0;
          return x;
        }),
        retryBackoff({ initialInterval: 1 }),
      )
      .subscribe(
        (x: number) => {
          expect(x).toEqual(42);
        },
        (err: any) => {
          expect('this was called').toBeTruthy();
        },
        done,
      );
  });

  it('should handle an empty source', () => {
    testScheduler.run(({ expectObservable, cold, expectSubscriptions }) => {
      const source = cold('|');
      const subs = '      (^!)';
      const expected = '  |';

      const result = source.pipe(retryBackoff(1));

      expectObservable(result).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(subs);
    });
  });

  it('should handle a never source', () => {
    testScheduler.run(({ expectObservable, cold, expectSubscriptions }) => {
      const source = cold('-');
      const subs = '       ^';
      const expected = '   -';

      const result = source.pipe(retryBackoff(1));

      expectObservable(result).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(subs);
    });
  });

  it('should return a never observable given an async just-throw source and no count', () => {
    testScheduler.run(({ expectObservable, cold }) => {
      const source = cold('-#'); // important that it's not a sync error
      const unsub = '      -------------------------------------!';
      const expected = '   --------------------------------------';

      const result = source.pipe(retryBackoff(1));

      expectObservable(result, unsub).toBe(expected);
    });
  });

  it('should handle a basic source that emits next then completes', () => {
    testScheduler.run(({ expectObservable, hot, expectSubscriptions }) => {
      const source = hot('--1--2--^--3--4--5---|');
      const subs = '      ^------------!';
      const expected = '  ---3--4--5---|';

      const result = source.pipe(retryBackoff(1));

      expectObservable(result).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(subs);
    });
  });

  it('should handle a basic source that emits next but does not complete', () => {
    testScheduler.run(({ expectObservable, hot, expectSubscriptions }) => {
      const source = hot('--1--2--^--3--4--5---');
      const subs = '              ^------------';
      const expected = '          ---3--4--5---';

      const result = source.pipe(retryBackoff(1));

      expectObservable(result).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(subs);
    });
  });

  it('should handle a basic source that emits next then errors, no maxRetries', () => {
    testScheduler.run(({ expectObservable, cold, expectSubscriptions }) => {
      const source = cold('--1-2-3-#');
      const unsub = '      -------------------------------------!';
      const subs = [
        '                  ^-------!                             ',
        '                  ---------^-------!                    ',
        '                  -------------------^-------!          ',
        '                  -------------------------------^-----!',
      ];
      const expected = '   --1-2-3----1-2-3-----1-2-3-------1-2--';

      const result = source.pipe(retryBackoff(1));

      expectObservable(result, unsub).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(subs);
    });
  });

  it('should handle a source which eventually throws, maxRetries=3, and result is ' + 'unsubscribed early', () => {
    testScheduler.run(({ expectObservable, cold, expectSubscriptions }) => {
      const source = cold('--1-2-3-#');
      const unsub = '      -------------!';
      const subs = ['                  ^-------!                ', '                  ---------^---!           '];
      const expected = '   --1-2-3----1--';

      const result = source.pipe(retryBackoff({ initialInterval: 1, maxRetries: 3 }));

      expectObservable(result, unsub).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(subs);
    });
  });

  it('should not break unsubscription chain when unsubscribed explicitly', () => {
    testScheduler.run(({ expectObservable, cold, expectSubscriptions }) => {
      const source = cold('--1-2-3-#');
      const subs = ['                  ^-------!                ', '                  ---------^---!           '];
      const expected = '   --1-2-3----1--';
      const unsub = '      -------------!           ';

      const result = source.pipe(
        mergeMap((x: string) => of(x)),
        retryBackoff(1),
        mergeMap((x: string) => of(x)),
      );

      expectObservable(result, unsub).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(subs);
    });
  });

  it('should retry a synchronous source (multicasted and refCounted) multiple times', (done) => {
    const expected = [1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3];

    of(1, 2, 3)
      .pipe(
        concat(throwError('bad!')),
        multicast(() => new Subject<number>()),
        refCount(),
        retryBackoff({ initialInterval: 1, maxRetries: 4 }),
      )
      .subscribe(
        (x: number) => {
          expect(x).toEqual(expected.shift());
        },
        (err: any) => {
          expect(err).toEqual('bad!');
          expect(expected.length).toEqual(0);
          done();
        },
        () => {
          done(new Error('should not be called'));
        },
      );
  });

  it('should increase the intervals exponentially up to maxInterval', () => {
    testScheduler.run(({ expectObservable, cold, expectSubscriptions }) => {
      const source = cold('--1-2-3-#');
      const subs = [
        '                  ^-------!',
        '                  ---------^-------!',
        '                  -------------------^-------!',
        '                  -----------------------------^-------!',
        //                      interval maxed out at 2 ^
      ];
      const unsub = '      -------------------------------------!';
      const expected = '   --1-2-3----1-2-3-----1-2-3-----1-2-3--';

      expectObservable(
        source.pipe(
          retryBackoff({
            initialInterval: 1,
            maxInterval: 2,
          }),
        ),
        unsub,
      ).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(subs);
    });
  });

  it('should retry until shouldRetry is true', (done) => {
    let errors = 0;
    const retries = 2;
    const isNotSoBad = (error: any) => error === 'not so bad';
    Observable.create((observer: Observer<number>) => {
      observer.next(42);
      observer.complete();
    })
      .pipe(
        map((x: any) => {
          errors += 1;
          throw errors < 2 ? 'not so bad' : 'really bad';
        }),
        retryBackoff({ initialInterval: 1, shouldRetry: isNotSoBad }),
      )
      .subscribe(
        () => {},
        (err: any) => {
          expect(errors).toEqual(2);
          expect(err).toEqual('really bad');
          done();
        },
      );
  });

  it('should increase the intervals calculated by backoffDelay function', () => {
    testScheduler.run(({ expectObservable, cold, expectSubscriptions }) => {
      const constantDelay = (iteration: number, initialInterval: number) => initialInterval;
      const source = cold('-1-#');
      const subs = [
        '                  ^--!',
        '                  ----^--!',
        '                  --------^--!',
        '                  ------------^--!',
        '                  ----------------^--!',
      ];
      const unsub = '      -------------------!';
      const expected = '   -1---1---1---1---1--';

      expectObservable(
        source.pipe(
          retryBackoff({
            initialInterval: 1,
            backoffDelay: constantDelay,
          }),
        ),
        unsub,
      ).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(subs);
    });
  });

  it('should be referentially transparent', () => {
    testScheduler.run(({ expectObservable, cold, expectSubscriptions }) => {
      const source1 = cold('--#');
      const source2 = cold('--#');
      const unsub = '      ---------!';
      const subs = ['                  ^-!       ', '                  ---^-!    ', '                  -------^-!'];
      const expected = '   ----------';

      const op = retryBackoff({
        initialInterval: 1,
      });

      expectObservable(source1.pipe(op), unsub).toBe(expected);
      expectSubscriptions(source1.subscriptions).toBe(subs);

      expectObservable(source2.pipe(op), unsub).toBe(expected);
      expectSubscriptions(source2.subscriptions).toBe(subs);
    });
  });

  it('should ensure interval state is per-subscription', () => {
    testScheduler.run(({ expectObservable, cold, expectSubscriptions }) => {
      const source = cold('--#');
      const sub1 = '      ^--------!';
      const sub2 = '      ----------^--------!';
      const subs = [
        '                  ^-!       ',
        '                  ---^-!    ',
        '                  -------^-!',
        '                  ----------^-!       ',
        '                  -------------^-!    ',
        '                  -----------------^-!',
      ];
      const expected = '   ----------';

      const result = source.pipe(
        retryBackoff({
          initialInterval: 1,
        }),
      );

      expectObservable(result, sub1).toBe(expected);
      expectObservable(result, sub2).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(subs);
    });
  });

  it('should reset the delay when resetOnSuccess is true', () => {
    testScheduler.run(({ expectObservable, cold, expectSubscriptions }) => {
      const source = cold('--1-2-3-#');
      const subs = [
        '                  ^-------!',
        '                  ---------^-------!',
        '                  ------------------^-------!',
        '                  ---------------------------^-------!',
        //                 interval always reset to 1 ^
      ];
      const unsub = '      -----------------------------------!';
      const expected = '   --1-2-3----1-2-3----1-2-3----1-2-3--';

      expectObservable(
        source.pipe(
          retryBackoff({
            initialInterval: 1,
            resetOnSuccess: true,
          }),
        ),
        unsub,
      ).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(subs);
    });
  });

  it('should not reset the delay on consecutive errors when resetOnSuccess is true', () => {
    testScheduler.run(({ expectObservable, cold, expectSubscriptions }) => {
      const source = cold('--------#');
      const unsub = '      -------------------------------------!';
      const subs = [
        '                  ^-------!                             ',
        '                  ---------^-------!                    ',
        '                  -------------------^-------!          ',
        '                  -------------------------------^-----!',
      ];
      const expected = '   --------------------------------------';

      const result = source.pipe(
        retryBackoff({
          initialInterval: 1,
          resetOnSuccess: true,
        }),
      );

      expectObservable(result, unsub).toBe(expected);
      expectSubscriptions(source.subscriptions).toBe(subs);
    });
  });
});
