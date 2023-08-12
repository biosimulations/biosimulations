import { Component } from '@angular/core';
import { ConfigService } from '@biosimulations/config/angular';
import { PROJEX_APP_ROUTES } from '../../app.component';

@Component({
  selector: 'biosimulations-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  public simulatorsAppRoute = PROJEX_APP_ROUTES.simulatorsApp;

  public constructor(public config: ConfigService) {}
}
