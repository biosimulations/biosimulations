import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass'],
})
export class LoginComponent implements OnInit {
  test: string = 'just a test';
  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.test = this.auth.test();
  }
}
