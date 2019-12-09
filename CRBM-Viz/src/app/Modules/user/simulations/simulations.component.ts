import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreadCrumbsService } from 'src/app/Shared/Services/bread-crumbs.service';
import { NavItemDisplayLevel } from 'src/app/Shared/Enums/nav-item-display-level';
import { NavItem } from 'src/app/Shared/Models/nav-item';
import { User } from 'src/app/Shared/Models/user';
import { AuthService } from 'src/app/Shared/Services/auth0.service';
import { UserService } from 'src/app/Shared/Services/user.service';

@Component({
  templateUrl: './simulations.component.html',
  styleUrls: ['./simulations.component.sass'],
})
export class SimulationsComponent implements OnInit {
  // TODO: only show simulations owned by user
  constructor(
    private route: ActivatedRoute,
    @Inject(BreadCrumbsService) private breadCrumbsService: BreadCrumbsService,
    public auth: AuthService,
    private userService: UserService) { }

  ngOnInit() {
    this.route.params.subscribe(routeParams => {
      let reqUsername: string;
      const authUsername: string = null;
      if (this.auth && this.auth.token) {
        // TODO get username from auth0 profile
        // authUsername = ...
      }

      if (routeParams.username) {
        reqUsername = routeParams['username'];
      }

      const crumbs: object[] = [{ label: 'User', route: '/user' }];
      const buttons: NavItem[] = [];

      if (reqUsername === null || reqUsername === authUsername) {
        crumbs.push({
          label: 'Your simulations',
        });
        buttons.push({
          iconType: 'fas',
          icon: 'plus',
          label: 'New',
          route: ['/simulations', 'new'],
          display: NavItemDisplayLevel.always
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
          label: reqUsername,
          route: '/user/' + reqUsername,
        });
        crumbs.push({
          label: 'Simulations',
        });
      }

      this.breadCrumbsService.set(crumbs, buttons);
    });
  }
}
