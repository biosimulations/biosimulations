import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from 'src/app/Shared/Services/auth0.service';
import { NavItemDisplayLevel } from 'src/app/Shared/Enums/nav-item-display-level';
import { NavItem } from 'src/app/Shared/Models/nav-item';
import { BreadCrumbsService } from 'src/app/Shared/Services/bread-crumbs.service';

@Component({
  selector: 'app-callback',
  templateUrl: './auth-0-callback.component.html',
  styleUrls: ['./auth-0-callback.component.sass'],
})
export class Auth0CallbackComponent implements OnInit {
  constructor(
      private auth: AuthService,
      @Inject(BreadCrumbsService) private breadCrumbsService: BreadCrumbsService) { }

  ngOnInit() {
    this.auth.handleAuthCallback();

    const crumbs: object[] = [
      {label: 'Logging in'},
    ];
    const buttons: NavItem[] = [];
    this.breadCrumbsService.set(crumbs, buttons);
  }
}
