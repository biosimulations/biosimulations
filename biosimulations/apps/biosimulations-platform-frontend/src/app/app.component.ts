import { Component } from '@angular/core';
import { AuthService } from '@biosimulations/auth/frontend';

@Component({
  selector: 'biosimulations-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'biosimulations-platform-frontend';
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
