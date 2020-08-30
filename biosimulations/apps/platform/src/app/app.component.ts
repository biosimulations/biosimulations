import { Component } from '@angular/core';
import { AuthService } from '@biosimulations/auth/angular';

@Component({
  selector: 'biosimulations-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'platform';
  constructor(private auth: AuthService) { }
  login() {
    this.auth.login();
  }
  logout() {
    this.auth.logout();
  }
  isAuthenticated() {
    return this.auth.isAuthenticated$;
  }
}
