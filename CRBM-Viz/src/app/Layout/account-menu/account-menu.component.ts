import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/Services/auth0.service';
import { MatMenu } from '@angular/material';
@Component({
  selector: 'app-account-menu',
  templateUrl: './account-menu.component.html',
  styleUrls: ['./account-menu.component.sass'],
})
export class AccountMenuComponent implements OnInit {
  @ViewChild('profileMenu', { static: true }) profileMenu: MatMenu;
  constructor(public auth: AuthService) {}

  ngOnInit() {}
}
