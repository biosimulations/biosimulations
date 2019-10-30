import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Services/auth0.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass'],
})
export class ProfileComponent implements OnInit {  
  constructor(public auth: AuthService) {}  

  ngOnInit() {}
}
