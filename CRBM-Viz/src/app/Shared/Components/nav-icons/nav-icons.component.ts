import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../Services/auth0.service';
import { UserMenuComponent } from '../user-menu/user-menu.component';

@Component({
  selector: 'app-nav-icons',
  templateUrl: './nav-icons.component.html',
  styleUrls: ['./nav-icons.component.sass'],
})
export class NavIconsComponent implements OnInit {
  @ViewChild(UserMenuComponent, { static: true })
  userMenu: UserMenuComponent;
  constructor(public auth: AuthService) {}

  ngOnInit() {}
}
