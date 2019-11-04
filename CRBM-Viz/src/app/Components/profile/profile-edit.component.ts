import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Shared/Services/auth0.service';
import { UserMetadata } from 'src/app/Shared/Models/user-metadata';

import { UserService } from 'src/app/Shared/Services/user.service';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-profile',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.sass'],
})

export class ProfileEditComponent implements OnInit {
  userData: Observable<any>;
  userMetadata: UserMetadata = null;
  constructor(public auth: AuthService, private users: UserService) {}

  ngOnInit() {
    // this.users.getUser().subscribe(res => (this.userData = res));
    this.userMetadata = new UserMetadata();
  }
}
