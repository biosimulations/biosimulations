import { Component, OnInit } from '@angular/core';
import { AuthService } from './Services/auth0.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent implements OnInit {
  title = 'CRBM-Viz';

  // TODO Test the creation of token
  constructor(private auth: AuthService) {}
  ngOnInit() {
    this.auth.localAuthSetup();
    this.auth.userProfile$.subscribe(profile => {
      this.auth.getToken$().subscribe(token => {
        if (token) {
          localStorage.setItem('token', token.__raw);
        }
      });
    });
  }
}
