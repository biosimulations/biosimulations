import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AsyncValidatorFn, AbstractControl } from '@angular/forms';
import { map, catchError, switchMap } from 'rxjs/operators';
import { of, timer, ObservableInput, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegistrationService {
  constructor(private http: HttpClient) {}

  register(username: string, token: string | null) {
    this.http
      .post('/api/users', { username, token })
      .pipe(catchError(this.handleError));
    // TODO Return the actual network call
    return timer(5000).pipe(switchMap(_ => of(username)));
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
          'https://api.biosimulations.dev/users/' + control.value,
        ),
      ),
      map(res => (res?.userName === value ? { used: true } : res)),
      catchError((err, caught) =>
        err.status === 404 ? of(null) : of({ 'Network Error': err }),
      ),
    );
  };
}
