import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ConfigService } from '@biosimulations/config/angular';
import { PLATFORM_APP_ROUTES } from '../../app.component';

@Component({
  selector: 'biosimulations-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public isMobileSimulations = false;
  public simulatorsAppUrl = PLATFORM_APP_ROUTES.simulatorsApp;

  public constructor(public config: ConfigService, private observer: BreakpointObserver) {
    /* Constructor is empty */
  }

  public ngOnInit(): void {
    this.observer.observe(Breakpoints.Handset).subscribe((result) => {
      if (result.matches) {
        this.isMobileSimulations = true;
      }
    });
  }
}
