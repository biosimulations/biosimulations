import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Shared/Services/auth0.service';

import { UserService } from 'src/app/Shared/Services/user.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass'],
})
export class ProfileComponent implements OnInit {
  userData;
  constructor(public auth: AuthService, private users: UserService) {}

  ngOnInit() {
    this.users.getUser().subscribe(res => (this.userData = res));
  }
}
