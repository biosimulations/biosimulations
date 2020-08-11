import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
import { AuthService } from '@biosimulations/auth/frontend';

@Component({
  selector: 'biosimulations-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopMenuComponent implements OnInit {
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

  ngOnInit(): void {}
}
