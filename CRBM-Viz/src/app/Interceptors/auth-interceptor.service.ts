import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpClient, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Router } from '@angular/router';
import { CrbmAuthService } from '../Services/crbm-auth.service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(
    private authService: CrbmAuthService,
    public http: HttpClient,
    private router: Router
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.authService.loggedInState) {
      req = req.clone({
        setHeaders: {
          idToken: this.authService.user.idToken
        }
      });
    }
    return next.handle(req).pipe(
      catchError(err => {
        if (err.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
        return throwError(err.error.message || err.statusText);
      })
    );
  }
}
