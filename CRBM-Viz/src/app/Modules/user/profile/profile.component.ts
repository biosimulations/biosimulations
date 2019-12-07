import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/Shared/Services/auth0.service';
import { User } from 'src/app/Shared/Models/user';
import { UserService } from 'src/app/Shared/Services/user.service';
import { NavItemDisplayLevel } from 'src/app/Shared/Enums/nav-item-display-level';
import { NavItem } from 'src/app/Shared/Models/nav-item';
import { BreadCrumbsService } from 'src/app/Shared/Services/bread-crumbs.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass'],
})

export class ProfileComponent implements OnInit {
  private username: string;
  user: User;

  constructor(
    private route: ActivatedRoute,
    @Inject(BreadCrumbsService) private breadCrumbsService: BreadCrumbsService,
    public auth: AuthService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.userService.getUser$().subscribe((user) =>
      this.user = user)
    // Todo remove auth0 logic, get id from user only. route params should check if user.nickname= user/Username
    this.route.params.subscribe(routeParams => {
      let auth0Id: string;
      if (this.auth && this.auth.token) {
        auth0Id = (this.auth.token.sub as unknown) as string;
      }

      if (routeParams.username) {
        this.username = routeParams['username'];
        this.user = this.userService.get(this.username);
        // this.users.getUser().subscribe(res => (this.user = res));
      } else if (auth0Id) {
        this.user = this.userService.getByAuth0Id(auth0Id);
        // this.users.getUser().subscribe(res => (this.user = res));
        this.username = this.user.username;
      }

      const crumbs: object[] = [{ label: 'User', route: '/user' }];
      const buttons: NavItem[] = [];
      if (this.user) {
        if (this.auth && this.user.auth0Id === auth0Id) {
          crumbs.push({
            label: 'Your profile',
          });
          buttons.push({
            iconType: 'fas',
            icon: 'pencil-alt',
            label: 'Edit',
            route: ['/user/edit'],
            display: NavItemDisplayLevel.loggedIn,
          });
        } else {
          crumbs.push({
            label: this.user.username,
          });
        }
      }

      this.breadCrumbsService.set(crumbs, buttons);
    });
  }
}
