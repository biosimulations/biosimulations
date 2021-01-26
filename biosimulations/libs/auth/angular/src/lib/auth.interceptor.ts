import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { AuthEnvironment } from './auth.environment';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService, private env: AuthEnvironment) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    if (req.url.includes(this.env.apiDomain) && this.auth.isAuthenticated()) {
      return this.auth.getTokenSilently$().pipe(
        // If there are any errors with authentication, try to proceed unauthenticated
        catchError(() => {
          return of(null);
        }),
        mergeMap((token) => {
          if (token) {
            const tokenReq = req.clone({
              setHeaders: { Authorization: `Bearer ${token}` },
            });
            return next.handle(tokenReq);
          } else {
            return next.handle(req);
          }
        }),
      );
    } else {
      return next.handle(req);
    }
  }
}
