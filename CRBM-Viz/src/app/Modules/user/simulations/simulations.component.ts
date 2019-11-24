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
    private userService: UserService) {}

  ngOnInit() {
    this.route.params.subscribe(routeParams => {
      let auth0Id: string;
      if (this.auth && this.auth.token) {
        auth0Id = (this.auth.token.sub as unknown) as string;
      }

      let username: string;
      let user: User;
      if (routeParams.username) {
        username = routeParams['username'];
        user = this.userService.get(username);
      } else if (auth0Id) {
        user = this.userService.getByAuth0Id(auth0Id);
        username = user.username;
      }

      const crumbs: object[] = [{label: 'User', route: '/user'}];
      const buttons: NavItem[] = [];

      if (user && user.auth0Id === auth0Id) {
        crumbs.push({
          label: 'Your simulations',
        });
        buttons.push({
          iconType: 'mat',
          icon: 'add',
          label: 'New',
          route: ['/simulations/new'],
          display: NavItemDisplayLevel.always
        });
      } else {
        crumbs.push({
          label: routeParams.username,
          route: '/user/' + routeParams.username,
        });
        crumbs.push({
          label: 'Simulations',
        });
      }

      this.breadCrumbsService.set(crumbs, buttons);
    });
  }
}
