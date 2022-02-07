import {
  defer,
  iif,
  Observable,
  throwError,
  timer,
  SchedulerLike,
  asyncScheduler,
  of,
} from 'rxjs';

import { concatMap, retryWhen, tap } from 'rxjs/operators';
import { exponentialBackoffDelay, getDelay } from './utils';
import { expand, mapTo } from 'rxjs/operators';
export interface RetryBackoffConfig {
  // Initial interval. It will eventually go as high as maxInterval.
  initialInterval: number;
  // Maximum number of retry attempts.
  maxRetries?: number;
  // Maximum delay between retries.
  maxInterval?: number;
  // When set to `true` every successful emission will reset the delay and the
  // error count.
  resetOnSuccess?: boolean;
  // Conditional retry.
  shouldRetry?: (error: any) => boolean;
  backoffDelay?: (iteration: number, initialInterval: number) => number;
}

/**
 * Returns an Observable that mirrors the source Observable with the exception
 * of an error. If the source Observable calls error, rather than propagating
 * the error call this method will resubscribe to the source Observable with
 * exponentially increasing interval and up to a maximum of count
 * resubscriptions (if provided). Retrying can be cancelled at any point if
 * shouldRetry returns false.
 */
export function retryBackoff(
  config: number | RetryBackoffConfig,
): <T>(source: Observable<T>) => Observable<T> {
  const {
    initialInterval,
    maxRetries = Infinity,
    maxInterval = Infinity,
    shouldRetry = () => true,
    resetOnSuccess = false,
    backoffDelay = exponentialBackoffDelay,
  } = typeof config === 'number' ? { initialInterval: config } : config;
  return <T>(source: Observable<T>) =>
    defer(() => {
      let index = 0;
      return source.pipe(
        retryWhen<T>((errors) =>
          errors.pipe(
            concatMap((error) => {
              const attempt = index++;
              return iif(
                () => attempt < maxRetries && shouldRetry(error),
                timer(
                  getDelay(backoffDelay(attempt, initialInterval), maxInterval),
                ),
                throwError(error),
              );
            }),
          ),
        ),
        tap(() => {
          if (resetOnSuccess) {
            index = 0;
          }
        }),
      );
    });
}

export interface IntervalBackoffConfig {
  initialInterval: number;
  maxInterval?: number;
  backoffDelay?: (iteration: number, initialInterval: number) => number;
}
/**
 * Creates an Observable that emits sequential numbers with by default
 * exponentially increasing interval of time.
 */
export function intervalBackoff(
  config: number | IntervalBackoffConfig,
  scheduler: SchedulerLike = asyncScheduler,
): Observable<number> {
  let {
    initialInterval,
    // eslint-disable-next-line prefer-const
    maxInterval = Infinity,
    // eslint-disable-next-line prefer-const
    backoffDelay = exponentialBackoffDelay,
  } = typeof config === 'number' ? { initialInterval: config } : config;
  initialInterval = initialInterval < 0 ? 0 : initialInterval;
  return of(0, scheduler).pipe(
    // Expend starts with number 1 and then recursively
    // projects each value to new Observable and puts it back in.
    expand((iteration) =>
      timer(getDelay(backoffDelay(iteration, initialInterval), maxInterval))
        // Once timer is complete, iteration is increased
        .pipe(mapTo(iteration + 1)),
    ),
  );
}
