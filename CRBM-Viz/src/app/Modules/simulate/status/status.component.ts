import { Component } from '@angular/core';
import { AuthService } from 'src/app/Shared/Services/auth0.service';

@Component({
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.sass'],
})
export class StatusComponent {
  // TODO: only show simulations owned by user
  constructor(public auth: AuthService) {}
}
