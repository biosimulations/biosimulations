import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ScrollService } from '@biosimulations/shared/angular';
import { ConfigService } from '@biosimulations/config/angular';
import { HealthService } from '@biosimulations/angular-api-client';
import { UpdateService } from '@biosimulations/shared/pwa';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { AppRoutes } from '@biosimulations/config/common';

export const DISPATCH_APP_ROUTES = new AppRoutes();

@Component({
  selector: 'biosimulations-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  public title = 'dispatch';
  public isMobileDispatch = false;
  public healthy$!: Observable<boolean>;
  public appRoutes = DISPATCH_APP_ROUTES;

  public constructor(
    public config: ConfigService,
    private scrollService: ScrollService,
    private updateService: UpdateService,
    private healthService: HealthService,
    private observer: BreakpointObserver,
  ) {}

  public ngOnInit(): void {
    this.healthy$ = this.healthService.isHealthy();
    this.checkClientScreenDispatch();
  }

  public ngAfterViewInit(): void {
    this.scrollService.init();
  }

  private checkClientScreenDispatch(): void {
    this.observer.observe(Breakpoints.Handset || Breakpoints.TabletLandscape).subscribe((result) => {
      if (result.matches) {
        this.isMobileDispatch = !this.isMobileDispatch;
      }
    });
  }
}
