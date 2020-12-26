import { NgModule, Injectable, ErrorHandler as BaseErrorHandler, NgZone } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '@biosimulations/shared/environments';
import { BiosimulationsError } from './biosimulations-error';

@Injectable()
export class ErrorHandler implements BaseErrorHandler {
  constructor(private ngZone: NgZone, private router: Router, private activatedRoute: ActivatedRoute) {}

  handleError(error: any): void {
    if (!environment.production) {
      console.error(error);
    }

    let errorTemplate = '500';
    const errorState: {code: number | string | undefined, message: string | undefined, details: string | undefined} = {
      code: undefined,
      message: undefined,
      details: undefined,
    };

    if (error instanceof HttpErrorResponse) {
      const config = this.getConfig(this.activatedRoute);
      const url = error.url;

      errorState.code = 500;
      errorState.message = 'Server error';

      if (url?.startsWith(config.platformApiUrl) ||
          url?.startsWith(config.dispatchApiUrl) ||
          url?.startsWith(config.simulatorsApiUrl)
      ) {
        errorState.details = 'Something went wrong with our server.';
      } else {
        errorState.details = 'Something went wrong.';
      }

    } else if (error instanceof BiosimulationsError) {
      const biosimulationsError = error as BiosimulationsError;

      if (biosimulationsError.code === 404) {
        errorTemplate = '404';
      }

      errorState.code = biosimulationsError.code;
      errorState.message = biosimulationsError.message;
      errorState.details = biosimulationsError.details;
    } else {
      errorState.code = '';
      errorState.message = 'Runtime error';
    }

    this.ngZone.run(() => {
      this.router.navigate(['/error', errorTemplate], {skipLocationChange: true, state: errorState});
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
