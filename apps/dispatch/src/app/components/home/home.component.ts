import { Component } from '@angular/core';
import { ConfigService } from '@biosimulations/shared/angular';

@Component({
  selector: 'biosimulations-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor(public config: ConfigService) {}
}
