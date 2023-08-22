import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ScrollService } from '@biosimulations/shared/angular';
import { ConfigService } from '@biosimulations/config/angular';
import { AppRoutes } from '@biosimulations/config/common';
import { HealthService } from './services/health/health.service';
import { UpdateService } from '@biosimulations/shared/pwa';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';

export const SIMULATORS_APP_ROUTES = new AppRoutes();
@Component({
  selector: 'biosimulations-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  public title = 'simulators';
  public healthy$!: Observable<boolean>;
  public isMobileSimulators = false;
  public browseRunsUrl!: string;
  public runUrl!: string;
  private _appRoutes: AppRoutes;

  public constructor(
    public config: ConfigService,
    private scrollService: ScrollService,
    private updateService: UpdateService,
    private healthService: HealthService,
    private observer: BreakpointObserver,
  ) {
    this._appRoutes = SIMULATORS_APP_ROUTES;
  }

  public get appRoutes(): AppRoutes {
    return this._appRoutes;
  }

  public set appRoutes(value: AppRoutes) {
    this._appRoutes = value;
  }

  public ngOnInit(): void {
    this.healthy$ = this.healthService.isHealthy();
    this.checkClientScreenSimulators();
    this.browseRunsUrl = this.appRoutes.dispatchApp + '/runs';
    this.runUrl = this.browseRunsUrl + '/new';
  }

  public ngAfterViewInit(): void {
    this.scrollService.init();
  }

  private checkClientScreenSimulators(): void {
    this.observer.observe(Breakpoints.Handset || Breakpoints.TabletLandscape).subscribe((result) => {
      if (result.matches) {
        this.isMobileSimulators = !this.isMobileSimulators;
      }
    });
  }
}
