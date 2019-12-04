import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
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
  formGroup: FormGroup;

  constructor(
    @Inject(BreadCrumbsService) private breadCrumbsService: BreadCrumbsService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    public auth: AuthService,
    private userService: UserService) {
    this.formGroup = this.formBuilder.group({
      username: [''],
      firstName: [''],
      middleName: [''],
      lastName: [''],
      organization: [''],
      website: [''],
      email: [''],
      emailPublic: [''],
      gravatarEmail: [''],
      gitHubId: [''],
      googleScholarId: [''],
      orcId: [''],
      description: [''],
    });
  }

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
      const user: User = this.userService.getByAuth0Id(auth0Id);
      this.formGroup.patchValue(user);
      // this.users.get().subscribe(res => (this.user = res));
    }
  }

  submit (): void {
    const data: User = this.formGroup.value as User;
    this.userService.set(data);

    this.snackBar.open('Profile saved', '', {
      panelClass: 'centered-snack-bar',
      duration: 3000,
    });
  }
}
