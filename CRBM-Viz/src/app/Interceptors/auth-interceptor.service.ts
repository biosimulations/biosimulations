import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpClient, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../Services/auth0.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(
    public http: HttpClient,
    private auth: AuthService,
    private router: Router
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.auth.isAuthenticated$.subscribe(isAuthenticated => {
      if (isAuthenticated) {

      }
    });
    if (this.auth.loggedIn) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
    }
    return next.handle(req).pipe(
      catchError(err => {
        if (err.status === 401) {
          this.auth.logout();
        }
        return throwError(err.error.message || err.statusText);
      })
    );
  }
}
