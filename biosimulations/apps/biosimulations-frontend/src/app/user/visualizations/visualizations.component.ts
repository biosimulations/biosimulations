import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreadCrumbsService } from '../../Shared/Services/bread-crumbs.service';
import { NavItemDisplayLevel } from '../../Shared/Enums/nav-item-display-level';

import { User } from '../../Shared/Models/user';
import { AuthService } from '../../Shared/Services/auth0.service';
import { UserService } from '../../Shared/Services/user.service';
import { NavItem } from '../../Shared/Enums/nav-item';

@Component({
  templateUrl: './visualizations.component.html',
  styleUrls: ['./visualizations.component.sass'],
})
export class VisualizationsComponent implements OnInit {
  public reqUsername: string;

  // TODO: only show visualizations owned by user
  constructor(
    private route: ActivatedRoute,
    @Inject(BreadCrumbsService) private breadCrumbsService: BreadCrumbsService,
    public auth: AuthService,
    private userService: UserService,
  ) {}

  ngOnInit() {
    this.route.params.subscribe(routeParams => {
      const authUsername: string = null;
      if (this.auth && this.auth.token) {
        // TODO get username from auth0 profile
        // authUsername = ...
      }

      if (routeParams.username) {
        this.reqUsername = routeParams['username'];
      } else {
        this.reqUsername = authUsername;
      }

      const crumbs: object[] = [{ label: 'User', route: '/user' }];
      const buttons: NavItem[] = [];

      if (this.reqUsername === null || this.reqUsername === authUsername) {
        crumbs.push({
          label: 'Your visualizations',
        });
        buttons.push({
          iconType: 'fas',
          icon: 'plus',
          label: 'New',
          route: ['/visualizations', 'new'],
          display: NavItemDisplayLevel.always,
        });
        buttons.push({
          iconType: 'fas',
          icon: 'list',
          label: 'Browse',
          route: ['/visualizations'],
          display: NavItemDisplayLevel.always,
        });
      } else {
        crumbs.push({
          label: this.reqUsername,
          route: '/user/' + this.reqUsername,
        });
        crumbs.push({
          label: 'Visualizations',
        });
      }

      this.breadCrumbsService.set(crumbs, buttons);
    });
  }
}
