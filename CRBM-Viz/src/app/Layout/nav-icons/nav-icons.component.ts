import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Services/auth0.service';

@Component({
  selector: 'app-nav-icons',
  templateUrl: './nav-icons.component.html',
  styleUrls: ['./nav-icons.component.sass'],
})
export class NavIconsComponent implements OnInit {
  constructor(public auth: AuthService) {}

  ngOnInit() {}
}
