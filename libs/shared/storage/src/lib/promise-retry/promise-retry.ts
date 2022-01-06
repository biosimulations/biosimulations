import * as errcode from 'err-code';
import * as retry from 'retry';

const hasOwn = Object.prototype.hasOwnProperty;

export function isRetryError(error: any) {
  return error && error.code === 'EPROMISERETRY' && hasOwn.call(error, 'retried');
}

type RetryFn = (error: any) => void;

export function promiseRetry<T>(fn: (retry: RetryFn, number: number) => Promise<T>, options: retry.OperationOptions): Promise<T> {
  const operation = retry.operation(options);

  return new Promise(function (resolve, reject) {
    operation.attempt(function (number) {
      Promise.resolve()
      .then(function () {
        return fn(function (error: any) {
          if (isRetryError(error)) {
            error = error.retried;
          }

          throw errcode.default(new Error('Retrying'), 'EPROMISERETRY', { retried: error });
        }, number);
      })
      .then(resolve, function (error: any) {
        if (isRetryError(error)) {
          error = error.retried;

          if (operation.retry(error || new Error())) {
            return;
          }
        }

        reject(error);
      });
    });
  });
}
