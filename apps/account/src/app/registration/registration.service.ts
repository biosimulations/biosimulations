import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AsyncValidatorFn, AbstractControl } from '@angular/forms';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { of, timer, ObservableInput, Observable, throwError } from 'rxjs';
import { urls } from '@biosimulations/config/common';
const baseUrl = urls.accountApi;
@Injectable({
  providedIn: 'root',
})
export class RegistrationService {
  constructor(private http: HttpClient) {}

  register(username: string, token: string | null, profile?: any) {
    return this.http
      .post(baseUrl, { username, token, profile })
      .pipe(catchError(this.handleError));
  }

  // TODO make sure this handles the error properly
  private handleError(err: any, caught: Observable<any>): ObservableInput<any> {
    return throwError('Registration Failed');
  }

  // Todo Abstract this
  uniqueUsernameAsyncValidator: AsyncValidatorFn = (
    control: AbstractControl,
  ) => {
    const value = control.value;
    return timer(500).pipe(
      switchMap((_) => this.http.get<any>(baseUrl + 'valid/' + control.value)),
      map((res) => (res.valid === true ? null : { server: res.message })),
      tap((_) => control.markAsTouched()),
      catchError((err, caught) => of({ 'Network Error': err })),
    );
  };
}
