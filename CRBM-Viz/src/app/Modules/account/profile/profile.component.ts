import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/Shared/Services/auth0.service';
import { User } from 'src/app/Shared/Models/user';
import { UserService } from 'src/app/Shared/Services/user.service';
import { BreadCrumbsService } from 'src/app/Shared/Services/bread-crumbs.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass'],
})

export class ProfileComponent implements OnInit {
  id: number;
  user: User;

  constructor(
    private route: ActivatedRoute,
    @Inject(BreadCrumbsService) private breadCrumbsService: BreadCrumbsService,
    public auth: AuthService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(routeParams => {
      let auth0Id: string;
      if (this.auth && this.auth.token) {
        auth0Id = (this.auth.token.sub as unknown) as string;
      }

      if (routeParams.id) {
        this.id = parseInt(routeParams['id'], 10);
        this.user = this.userService.get(this.id);
        // this.users.getUser().subscribe(res => (this.user = res));
      } else if (auth0Id) {
        this.user = this.userService.getByAuth0Id(auth0Id);
        // this.users.getUser().subscribe(res => (this.user = res));
        this.id = this.user.id;
      }

      const crumbs: object[] = [{label: 'Profile'}]
      const buttons: object[] = [];
      if (this.user) {
        if (this.auth && this.user.auth0Id === auth0Id) {
          buttons.push({
            iconType: 'mat',
            icon: 'edit',
            label: 'Edit',
            route: ['/user/edit'],
          });
        } else {
          crumbs.push({
            label: this.user.getFullName(),
          });
        }
      }

      this.breadCrumbsService.set(crumbs, buttons);
    });
  }
}
