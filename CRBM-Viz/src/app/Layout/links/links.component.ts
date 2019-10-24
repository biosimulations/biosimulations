import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Services/auth0.service';
import { Subscription } from 'rxjs';
// TODO create an object for nav-item. Create list of nav-items with children
@Component({
  selector: 'app-links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.sass'],
})
export class LinksComponent implements OnInit {
  constructor(public auth: AuthService) {}

  ngOnInit() {}
}
