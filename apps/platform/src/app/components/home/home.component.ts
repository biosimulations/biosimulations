import { Component } from '@angular/core';
import { ConfigService } from '@biosimulations/config/angular';

@Component({
  selector: 'biosimulations-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  public constructor(public config: ConfigService) {}
}
