import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/Shared/Services/auth0.service';
import { User } from 'src/app/Shared/Models/user';
import { UserService } from 'src/app/Shared/Services/user.service';
import { NavItemDisplayLevel } from 'src/app/Shared/Enums/nav-item-display-level';
import { NavItem } from 'src/app/Shared/Models/nav-item';
import { BreadCrumbsService } from 'src/app/Shared/Services/bread-crumbs.service';
import md5 from 'md5';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass'],
})
export class ProfileComponent implements OnInit {
  /**
   * The object representing the user displayed in the profile
   */
  user: User;
  gravatarId: string;
  private loggedInUsername: string;

  constructor(
    private route: ActivatedRoute,
    @Inject(BreadCrumbsService) private breadCrumbsService: BreadCrumbsService,
    public auth: AuthService,
    private userService: UserService
  ) {}

  /**
   * The init method subscribes to the user profile and the route. If a url parameter is provided, it pulls the username from
   * the user service. If not, it assumes the logged in profile's username. It then calls a method to create the view's breadcrumbs
   */
  ngOnInit() {
    this.auth.getUsername$().subscribe(name => {
      this.loggedInUsername = name;
      console.log(name);

      this.route.params.subscribe(routeParams => {
        let username;
        if (routeParams.username) {
          username = routeParams.username;
        } else {
          username = this.loggedInUsername;
        }
        this.userService.getUser$(username).subscribe(user => {
          console.warn(user);
          this.user = user;
          this.gravatarId = md5(user.gravatarEmail.trim().toLowerCase());
        });

        this.setCrumbs(username === this.loggedInUsername);
      });
    });
  }

  /**
   * This method takes in a boolean and then constructs the appropriate crumbs. If the displayed profile is the users
   * profile, the breadcrumbs state "Your profile" and provide a link to edit the profile. If not, then the username of the
   *  profile is displayed. This method depends on the breadcrumbs service
   * @param isOwnProfile Whether the crumbs should reflect the user's own profile, or another users profile
   */
  setCrumbs(isOwnProfile: boolean) {
    const crumbs: object[] = [{ label: 'User', route: '/user' }];
    const buttons: NavItem[] = [];
    if (isOwnProfile) {
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
        label: this.user.userName,
      });
    }
    this.breadCrumbsService.set(crumbs, buttons);
  }
}
