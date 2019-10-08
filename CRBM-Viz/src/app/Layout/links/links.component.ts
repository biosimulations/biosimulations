import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Services/auth0.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.sass'],
})
export class LinksComponent implements OnInit {
  constructor(public auth: AuthService) {}

  ngOnInit() {
    this.auth.userProfile$.subscribe(
      profile => {
        this.auth.getToken$().subscribe(token => {
          localStorage.setItem('token', token);
        });
      }
    );
  }
}
