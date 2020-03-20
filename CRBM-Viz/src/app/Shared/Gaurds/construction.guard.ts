import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { ConfigurationService } from '../Services/configuration.service';
import { pluck, tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ConstructionGuard implements CanActivate {
  constructor(private config: ConfigurationService, private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.config.showUnderConstructionPage$.pipe(
      tap(redirect => {
        if (redirect) {
          this.router.navigateByUrl('/errors/underConstruction');
        }
      }),
      map(redirect => !redirect)
    );
  }
}
