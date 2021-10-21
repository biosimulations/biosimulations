import { Observable, throwError, timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

export class RetryStrategy {
  public constructor(
    private maxAttempts = 7,
    private initialDelayMs = 1000,
    private scalingFactor = 2,
    private includedStatusCodes: number[] = [500],
    private excludedStatusCodes: number[] = [],
    private shouldErrorBeRetried: (error: HttpErrorResponse) => boolean = (
      error: HttpErrorResponse,
    ) => true,
  ) {}

  public handler(attempts: Observable<any>): Observable<any> {
    return attempts.pipe(
      mergeMap(
        (
          error: HttpErrorResponse,
          iRetryAttempt: number,
        ): Observable<number> => {
          if (iRetryAttempt + 1 >= this.maxAttempts) {
            return throwError(() => error);
          }

          if (
            this.includedStatusCodes.length &&
            !this.includedStatusCodes.includes(error.status)
          ) {
            return throwError(() => error);
          }

          if (this.excludedStatusCodes.includes(error.status)) {
            return throwError(() => error);
          }

          if (!this.shouldErrorBeRetried(error)) {
            return throwError(() => error);
          }

          const delay =
            this.initialDelayMs * this.scalingFactor ** iRetryAttempt;
          return timer(delay);
        },
      ),
    );
  }
}
