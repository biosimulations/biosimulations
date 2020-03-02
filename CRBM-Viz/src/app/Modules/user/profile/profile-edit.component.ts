import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  MatSnackBar,
  MatSnackBarRef,
  SimpleSnackBar,
} from '@angular/material/snack-bar';
import { AuthService } from 'src/app/Shared/Services/auth0.service';
import { User, UserSerializer } from 'src/app/Shared/Models/user';
import { UserService } from 'src/app/Shared/Services/user.service';
import { NavItemDisplayLevel } from 'src/app/Shared/Enums/nav-item-display-level';
import { NavItem } from 'src/app/Shared/Models/nav-item';
import { BreadCrumbsService } from 'src/app/Shared/Services/bread-crumbs.service';
import { Observable, merge } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { ProvidedFilter } from 'ag-grid-community';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.sass'],
})
export class ProfileEditComponent implements OnInit {
  formGroup: FormGroup;
  userSerializer: UserSerializer;

  constructor(
    @Inject(BreadCrumbsService) private breadCrumbsService: BreadCrumbsService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    public auth: AuthService,
    private userService: UserService,
    private router: Router
  ) {
    this.userSerializer = new UserSerializer();
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
    const saving = this.saving();
    const username = this.auth.getUsername$();
    const userId = this.auth.getUser$().pipe();
    const data: User = this.userSerializer.fromJson(this.formGroup.value);
    console.log(data);

    this.auth.getUsername$().subscribe(name => {
      this.auth
        .getUser$()
        .pipe(pluck('sub'))
        .subscribe(id => {
          this.userService.set(data, name, id).subscribe(
            user => {
              saving.dismiss();
              this.success();
              this.router.navigate(['/user', user.userName]);
            },
            err => {
              saving.dismiss();
              this.error(err);
            }
          );
        });
    });
  }
  saving(): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open('Saving...', '', {
      panelClass: ['centered-snack-bar'],
      duration: 3000,
    });
  }
  success(): void {
    this.snackBar.open('Profile saved', '', {
      panelClass: ['centered-snack-bar', 'snackbar-success'],
      duration: 3000,
    });
  }
  error(error): void {
    let detail;
    if (error.status === 0) {
      detail = 'Could not connect to server';
    } else {
      detail = error.error.detail as string;
    }

    this.snackBar.open('Error saving profile: ' + detail, '', {
      panelClass: ['centered-snack-bar', 'snackbar-error'],
      duration: 3000,
    });
    console.log(error);
  }
}
