import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AuthService } from '@biosimulations/auth/frontend';
import { Observable } from 'rxjs';

@Component({
  selector: 'biosimulations-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  loggedIn!: Observable<boolean>;
  asyncLoggedIn = this.auth.isAuthenticated();
  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.loggedIn = this.auth.isAuthenticated$;
    this.asyncLoggedIn = this.auth.isAuthenticated();
  }
  refresh() {
    this.asyncLoggedIn = this.auth.isAuthenticated();
  }
}
