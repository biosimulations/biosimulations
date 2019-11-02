import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Shared/Services/auth0.service';
import { Profile } from 'src/app/Shared/Models/profile';

import { UserService } from 'src/app/Shared/Services/user.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass'],
})

export class ProfileComponent implements OnInit {
  userData;
  profile: Profile = null;
  constructor(public auth: AuthService, private users: UserService) {
    this.profile = new Profile();
  }

  ngOnInit() {
    this.users.getUser().subscribe(res => (this.userData = res));
  }
}
