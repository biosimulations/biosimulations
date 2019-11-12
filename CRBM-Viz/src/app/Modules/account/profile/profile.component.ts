import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Shared/Services/auth0.service';
import { User } from 'src/app/Shared/Models/user';

import { UserService } from 'src/app/Shared/Services/user.service';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass'],
})

export class ProfileComponent implements OnInit {
  userData: Observable<any>;
  user: User = null;
  constructor(public auth: AuthService, private users: UserService) {}

  ngOnInit() {
    // this.users.getUser().subscribe(res => (this.userData = res));
    this.user = new User();
  }
}
