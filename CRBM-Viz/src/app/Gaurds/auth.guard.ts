import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CrbmAuthService } from '../Services/crbm-auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private crbmAuthService: CrbmAuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (!this.crbmAuthService.isLoggedIn()) {
        this.router.navigate(['/login']);
      }

      if (this.crbmAuthService.isLoggedIn()) {
        return true;
      }

      return false;
  }

}
