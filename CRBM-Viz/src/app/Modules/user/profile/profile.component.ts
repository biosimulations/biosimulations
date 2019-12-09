import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/Shared/Services/auth0.service';
import { User } from 'src/app/Shared/Models/user';
import { UserService } from 'src/app/Shared/Services/user.service';
import { NavItemDisplayLevel } from 'src/app/Shared/Enums/nav-item-display-level';
import { NavItem } from 'src/app/Shared/Models/nav-item';
import { BreadCrumbsService } from 'src/app/Shared/Services/bread-crumbs.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass'],
})

export class ProfileComponent implements OnInit {
  user: User;

  constructor(
    private route: ActivatedRoute,
    @Inject(BreadCrumbsService) private breadCrumbsService: BreadCrumbsService,
    public auth: AuthService,
    private userService: UserService
  ) { }


  ngOnInit() {
    this.auth.getUser$().subscribe(profile => {

      this.route.params.subscribe(routeParams => {
        let username;
        if (routeParams.username) {
          username = routeParams.username
        }
        else {
          username = profile.nickname
        }
        this.userService.get$(username).subscribe(user => {
          this.user = user
        });

        this.setCrumbs(username === profile.nickname);
      })
    })
  }

  setCrumbs(isOwnProfile: boolean) {
    let crumbs: object[] = [{ label: 'User', route: '/user' }];
    let buttons: NavItem[] = [];
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
        label: this.user.username
      })
    }
    this.breadCrumbsService.set(crumbs, buttons);

  }
}






