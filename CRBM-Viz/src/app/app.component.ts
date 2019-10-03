import { Component, OnInit } from '@angular/core';
import { CrbmAuthService } from './Services/crbm-auth.service';
import { AuthService } from './Services/auth0.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent implements OnInit {
  title = 'CRBM-Viz';

  constructor(
    public crbmAuthService: CrbmAuthService,
    private auth: AuthService
  ) {}
  ngOnInit() {
    this.auth.localAuthSetup();
  }
}
