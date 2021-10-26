import {
  Injectable,
  ErrorHandler as BaseErrorHandler,
  NgZone,
} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '@biosimulations/shared/environments';
import { BiosimulationsError } from './biosimulations-error';
import StackdriverErrorReporter from 'stackdriver-errors-js';
import { MatDialog } from '@angular/material/dialog';
import { Error500DialogComponent } from './error-500-dialog.component';

interface ErrorState {
  code: number | undefined;
  message: string | undefined;
  details: string | undefined;
}

@Injectable()
export class ErrorHandler implements BaseErrorHandler {
  errorHandler = new StackdriverErrorReporter();
  constructor(
    private ngZone: NgZone,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
  ) {
    this.errorHandler.start({
      key: 'AIzaSyBoUe5xMNiF1_1UmIfMk9LSwAztcOSzRIU',
      projectId: 'biosimulations',
    });
  }

  handleError(error: any): void {
    console.error(error);

    let errorTemplate = '500';
    const errorState: ErrorState = {
      code: undefined,
      message: undefined,
      details: undefined,
    };

    if (error instanceof HttpErrorResponse) {
      const httpError = error as HttpErrorResponse;

      // The error library cannot handle HttpErrorResponses, so we convert to a regular Error with a meaninful
      const reportedError = new Error(httpError.message);

      // Error status defaults to "okay", but error can never be okay
      const errorText =
        httpError.statusText == 'OK' ? null : httpError.statusText;
      reportedError.name = errorText || httpError.name + httpError.status;
      if (environment.production) {
        this.errorHandler.report(reportedError);
      }

      const config = this.getConfig(this.activatedRoute);
      const url = error.url;

      errorState.code = httpError.status || 500;

      errorState.message = errorText || 'Error';

      if (
        url?.startsWith(config.platformApiUrl) ||
        url?.startsWith(config.dispatchApiUrl) ||
        url?.startsWith(config.simulatorsApiUrl)
      ) {
        errorState.details = 'Something went wrong with our server.';
      } else {
        errorState.details = 'Something went wrong.';
      }
      if (errorState.code == 404) {
        errorTemplate = '404';

        errorState.message = 'Not Found';
        errorState.details = 'The requested resource was not found.';
      }
    } else if (error instanceof BiosimulationsError) {
      const biosimulationsError = error as BiosimulationsError;

      if (environment.production) {
        this.errorHandler.report(error);
      }

      if (biosimulationsError.code === 404) {
        errorTemplate = '404';
      }

      errorState.code = biosimulationsError.code;
      errorState.message = biosimulationsError.message;
      errorState.details = biosimulationsError.details;
    } else {
      if (environment.production) {
        this.errorHandler.report(error);
      }

      errorState.code = undefined;
      errorState.message = 'Runtime error';
    }

    this.ngZone.run(() => {
      switch (errorTemplate) {
        case '500': {
          this.dialog.open(Error500DialogComponent, { data: errorState });
          break;
        }
        default: {
          this.router.navigate(['/error', errorTemplate], {
            skipLocationChange: true,
            state: errorState,
          });
        }
      }
    });
  }

  private getConfig(route: ActivatedRoute): any {
    if (route.snapshot.data?.config !== undefined) {
      return route.snapshot.data.config;
    }

    if (route.firstChild) {
      return this.getConfig(route.firstChild);
    }

    return undefined;
  }
}
