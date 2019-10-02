import { Component, OnInit } from '@angular/core';
import { CrbmAuthService } from 'src/app/Services/crbm-auth.service';
import { AuthService } from 'angularx-social-login';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.sass'],
})
export class TopbarComponent implements OnInit {
  constructor(public crbmAuthService: CrbmAuthService) {}

  ngOnInit() {}
}
