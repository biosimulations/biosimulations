import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreadCrumbsService } from 'src/app/Shared/Services/bread-crumbs.service';

import { User } from 'src/app/Shared/Models/user';
import { AuthService } from 'src/app/Shared/Services/auth0.service';
import { UserService } from 'src/app/Shared/Services/user.service';
import { NavItem } from '../../../Shared/Enums/nav-item';
import { NavItemDisplayLevel } from '../../../Shared/Enums/nav-item-display-level';

@Component({
  templateUrl: './simulations.component.html',
  styleUrls: ['./simulations.component.sass'],
})
export class SimulationsComponent implements OnInit {
  public reqUsername: string;

  // TODO: only show simulations owned by user
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
          label: 'Your simulations',
        });
        buttons.push({
          iconType: 'fas',
          icon: 'plus',
          label: 'New',
          route: ['/simulations', 'new'],
          display: NavItemDisplayLevel.always,
        });
        buttons.push({
          iconType: 'fas',
          icon: 'list',
          label: 'Browse',
          route: ['/simulations'],
          display: NavItemDisplayLevel.always,
        });
      } else {
        crumbs.push({
          label: this.reqUsername,
          route: '/user/' + this.reqUsername,
        });
        crumbs.push({
          label: 'Simulations',
        });
      }

      this.breadCrumbsService.set(crumbs, buttons);
    });
  }
}
