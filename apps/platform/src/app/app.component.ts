import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ScrollService } from '@biosimulations/shared/angular';
import { ConfigService } from '@biosimulations/config/angular';
import { HealthService } from '@biosimulations/angular-api-client';
import { UpdateService } from '@biosimulations/shared/pwa';
import { AppRoutes } from '@biosimulations/config/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

export const PLATFORM_APP_ROUTES = new AppRoutes();
@Component({
  selector: 'biosimulations-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  public title = 'platform';
  public healthy$!: Observable<boolean>;
  public isMobileSimulations = false;
  private checkForHealth = true;
  public mobileLinkTarget = '_blank';
  public mobileLink?: string;
  private _appRoutes: AppRoutes;

  public constructor(
    public config: ConfigService,
    public dialog: MatDialog,
    private scrollService: ScrollService,
    private updateService: UpdateService,
    private healthService: HealthService,
    private breakpointObserver: BreakpointObserver,
  ) {
    this._appRoutes = PLATFORM_APP_ROUTES;
  }

  public get appRoutes(): AppRoutes {
    return this._appRoutes;
  }

  public set appRoutes(value: AppRoutes) {
    this._appRoutes = value;
  }

  public ngOnInit(): void {
    if (this.checkForHealth) {
      this.healthy$ = this.healthService.isHealthy();
      console.log(this.healthy$);
    }
    this.checkClientScreenSimulations();
  }

  public ngAfterViewInit(): void {
    this.scrollService.init();
  }

  private checkClientScreenSimulations(): void {
    this.breakpointObserver.observe(Breakpoints.Handset || Breakpoints.TabletLandscape).subscribe((result) => {
      if (result.matches) {
        this.toggleMobile();
      }
    });
  }

  private toggleMobile(): void {
    this.isMobileSimulations = !this.isMobileSimulations;
  }

  public navigateToMobileLink(mobileLink: string): void {
    window.open(mobileLink, this.mobileLinkTarget);
  }
}
