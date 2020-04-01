import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../Services/auth0.service';
import { MatMenu } from '@angular/material/menu';
@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.sass'],
})
export class UserMenuComponent implements OnInit {
  @ViewChild('profileMenu', { static: true }) profileMenu: MatMenu;
  constructor(public auth: AuthService) {}

  ngOnInit() {}
}
