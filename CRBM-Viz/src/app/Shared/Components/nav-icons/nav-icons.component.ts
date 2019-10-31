import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../Services/auth0.service';
import { AccountMenuComponent } from '../account-menu/account-menu.component';

@Component({
  selector: 'app-nav-icons',
  templateUrl: './nav-icons.component.html',
  styleUrls: ['./nav-icons.component.sass'],
})
export class NavIconsComponent implements OnInit {
  @ViewChild(AccountMenuComponent, { static: true })
  accountMenu: AccountMenuComponent;
  constructor(public auth: AuthService) {}

  ngOnInit() {}
}
