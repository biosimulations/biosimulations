import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AsyncValidatorFn, AbstractControl } from '@angular/forms';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { of, timer, ObservableInput, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment'
@Injectable({
  providedIn: 'root',
})
export class RegistrationService {
  constructor(private http: HttpClient) { }

  register(username: string, token: string | null, profile?: any) {
    return this.http
      .post(environment.api, { username, token, profile })
      .pipe(catchError(this.handleError));


  }

  // TODO make sure this handles the error properly
  private handleError(
    err: any,
    caught: Observable<object>,
  ): ObservableInput<any> {
    return throwError('Not yet implemented');
  }

  // Todo Abstract this
  uniqueUsernameAsyncValidator: AsyncValidatorFn = (
    control: AbstractControl,
  ) => {
    const value = control.value;
    // The validation calls the User api for the given username. if you get a 404, then the username is available
    // Browser will display console error for every bad call.Maybe include an actual endpoint to test this ?
    return timer(500).pipe(
      switchMap(_ =>
        this.http.get<any>(
          environment.api + 'valid/' + control.value,
        ),
      ),
      map(res => res.valid == true ? (null) : { "server": res.message }),
      tap(_ => control.markAsTouched()),
      catchError((err, caught) =>
        of({ 'Network Error': err }),
      ),
    );
  };
}
