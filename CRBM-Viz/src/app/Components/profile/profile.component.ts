import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Shared/Services/auth0.service';
import { Profile } from 'src/app/Shared/Models/profile';

import { UserService } from 'src/app/Shared/Services/user.service';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass'],
})

export class ProfileComponent implements OnInit {
  userData: Observable<any>;
  profile: Profile = null;
  constructor(public auth: AuthService, private users: UserService) {}

  ngOnInit() {
    // this.users.getUser().subscribe(res => (this.userData = res));
    this.profile = new Profile();
  }
}
