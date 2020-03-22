import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { AuthService } from 'src/app/Shared/Services/auth0.service';
import { Observable, throwError, of } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (
      req.url.startsWith(environment.crbm.CRBMAPI_URL) &&
      this.auth.loggedIn
    ) {
      return this.auth.getTokenSilently$().pipe(
        // If there are any errors with authentication, try to proceed unauthenticated
        catchError(err => {
          return of(null);
        }),
        mergeMap(token => {
          if (!!token) {
            const tokenReq = req.clone({
              setHeaders: { Authorization: `Bearer ${token}` },
            });
            return next.handle(tokenReq);
          } else {
            return next.handle(req);
          }
        })
      );
    } else {
      return next.handle(req);
    }
  }
}
