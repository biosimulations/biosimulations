import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreadCrumbsService } from '../../Shared/Services/bread-crumbs.service';
import { NavItemDisplayLevel } from '../../Shared/Enums/nav-item-display-level';
import { AuthService } from '../../Shared/Services/auth0.service';
import { UserService } from '../../Shared/Services/user.service';
import { NavItem } from '../../Shared/Enums/nav-item';

@Component({
  templateUrl: './models.component.html',
  styleUrls: ['./models.component.sass'],
})
export class ModelsComponent implements OnInit {
  public reqUsername: string;

  constructor(
    private route: ActivatedRoute,
    @Inject(BreadCrumbsService) private breadCrumbsService: BreadCrumbsService,
    public auth: AuthService,
    private userService: UserService,
  ) {}

  ngOnInit() {
    this.route.params.subscribe(routeParams => {
      let authUsername: string = null;
      if (this.auth) {
        this.auth.getUsername$().subscribe(name => {
          authUsername = name;

          if (routeParams.username) {
            this.reqUsername = routeParams['username'];
          } else {
            this.reqUsername = authUsername;
          }
          const crumbs: object[] = [{ label: 'User', route: '/user' }];
          const buttons: NavItem[] = [];

          if (this.reqUsername === null || this.reqUsername === authUsername) {
            crumbs.push({
              label: 'Your models',
            });
            buttons.push({
              iconType: 'fas',
              icon: 'plus',
              label: 'New',
              route: ['/models', 'new'],
              display: NavItemDisplayLevel.always,
            });
            buttons.push({
              iconType: 'fas',
              icon: 'list',
              label: 'Browse',
              route: ['/models'],
              display: NavItemDisplayLevel.always,
            });
          } else {
            crumbs.push({
              label: this.reqUsername,
              route: '/user/' + this.reqUsername,
            });
            crumbs.push({
              label: 'Models',
            });
          }

          this.breadCrumbsService.set(crumbs, buttons);
        });
      }
    });
  }
}
