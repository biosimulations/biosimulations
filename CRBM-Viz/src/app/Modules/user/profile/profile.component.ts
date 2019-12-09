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
  crumbs: object[] = [{ label: 'User', route: '/user' }];
  buttons: NavItem[] = [];
  constructor(
    private route: ActivatedRoute,
    @Inject(BreadCrumbsService) private breadCrumbsService: BreadCrumbsService,
    public auth: AuthService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(routeParams => {
      const username = routeParams.username
      this.auth.getUser$().subscribe(profile => {
        if (username) {
          this.userService.get$(username).subscribe(user => {
            this.user = user
          });
        }
        else {
          this.userService.get$(profile.nickname).subscribe(user => {
            this.user = user
          })
        }
        if (this.user.username === profile.nickname) {
          this.crumbs.push({
            label: 'Your profile',
          });
          this.buttons.push({
            iconType: 'fas',
            icon: 'pencil-alt',
            label: 'Edit',
            route: ['/user/edit'],
            display: NavItemDisplayLevel.loggedIn,
          });
        } else {
          this.crumbs.push({
            label: this.user.username

          })
        }
        this.breadCrumbsService.set(this.crumbs, this.buttons);
      })
    });
  }
}




