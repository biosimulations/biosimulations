import { Component, AfterViewInit } from '@angular/core';
import { ConfigService, ScrollService } from '@biosimulations/shared/services';
import { AuthService } from '@biosimulations/auth/angular';

@Component({
  selector: 'biosimulations-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  title = 'platform';
  constructor(
    public config: ConfigService,
    private scrollService: ScrollService,
    private auth: AuthService,
  ) {}

  ngAfterViewInit(): void {
    this.scrollService.init();
  }

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
