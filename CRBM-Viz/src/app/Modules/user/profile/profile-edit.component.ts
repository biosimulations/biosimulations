import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/Shared/Services/auth0.service';
import { User } from 'src/app/Shared/Models/user';
import { UserService } from 'src/app/Shared/Services/user.service';
import { NavItemDisplayLevel } from 'src/app/Shared/Enums/nav-item-display-level';
import { NavItem } from 'src/app/Shared/Models/nav-item';
import { BreadCrumbsService } from 'src/app/Shared/Services/bread-crumbs.service';
import { Observable, merge } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { ProvidedFilter } from 'ag-grid-community';

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
    private userService: UserService
  ) {
    this.formGroup = this.formBuilder.group({
      userName: [''],
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
      { label: 'User', route: ['/user'] },
      { label: 'Edit your profile' },
    ];
    const buttons: NavItem[] = [
      {
        iconType: 'fas',
        icon: 'user',
        label: 'View',
        route: ['/user'],
        display: NavItemDisplayLevel.loggedIn,
      },
    ];
    this.breadCrumbsService.set(crumbs, buttons);
    let user: User;
    this.auth.getUsername$().subscribe(username => {
      this.userService.get$(username).subscribe(loggedInUser => {
        user = loggedInUser;
        this.formGroup.patchValue(user);
      });
    });

    // this.users.get().subscribe(res => (this.user = res));
  }

  submit(): void {
    const username = this.auth.getUsername$();
    const userId = this.auth.getUser$().pipe();
    const data: User = this.formGroup.value as User;
    this.auth.getUsername$().subscribe(name => {
      this.auth
        .getUser$()
        .pipe(pluck('sub'))
        .subscribe(id => {
          this.userService.set(data, name, id);
        });
    });
    // TODO catch the errors when setting, give different snackbar for errors
    this.snackBar.open('Profile saved', '', {
      panelClass: 'centered-snack-bar',
      duration: 3000,
    });
  }
}
