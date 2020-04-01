import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from '../../Services/auth0.service';
import { NavItemDisplayLevel } from '../../Enums/nav-item-display-level';
import { NavItem } from '../../Enums/nav-item';
import { BreadCrumbsService } from '../../Services/bread-crumbs.service';

@Component({
  selector: 'app-callback',
  templateUrl: './auth-0-callback.component.html',
  styleUrls: ['./auth-0-callback.component.sass'],
})
export class Auth0CallbackComponent implements OnInit {
  constructor(
    private auth: AuthService,
    @Inject(BreadCrumbsService) private breadCrumbsService: BreadCrumbsService,
  ) {}

  ngOnInit() {
    this.auth.handleAuthCallback();

    const crumbs: object[] = [{ label: 'Logging in' }];
    const buttons: NavItem[] = [];
    this.breadCrumbsService.set(crumbs, buttons);
  }
}
