import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from 'src/app/Shared/Services/auth0.service';
import { User } from 'src/app/Shared/Models/user';
import { UserService } from 'src/app/Shared/Services/user.service';
import { NavItemDisplayLevel } from 'src/app/Shared/Enums/nav-item-display-level';
import { NavItem } from 'src/app/Shared/Models/nav-item';
import { BreadCrumbsService } from 'src/app/Shared/Services/bread-crumbs.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.sass'],
})

export class ProfileEditComponent implements OnInit {
  user: User;
  showAfterSubmitMessage = false;

  constructor(
    @Inject(BreadCrumbsService) private breadCrumbsService: BreadCrumbsService,
    public auth: AuthService,
    private userService: UserService) {}

  ngOnInit() {
    const crumbs: object[] = [
      {label: 'User', route: ['/user']},
      {label: 'Edit your profile'},
    ];
    const buttons: NavItem[] = [
      {iconType: 'fas', icon: 'user', label: 'View', route: ['/user'], display: NavItemDisplayLevel.loggedIn},
    ];
    this.breadCrumbsService.set(crumbs, buttons);

    if (this.auth && this.auth.token && this.auth.token.sub) {
      const auth0Id: string = (this.auth.token.sub as unknown) as string;
      this.user = this.userService.getByAuth0Id(auth0Id);
      // this.users.get().subscribe(res => (this.user = res));
    }
  }

  submit (): void {
    this.userService.set(this.user);

    this.showAfterSubmitMessage = true;
    setTimeout(() => {
      this.showAfterSubmitMessage = false;
    }, 2500);
  }
}
