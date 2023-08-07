import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ScrollService } from '@biosimulations/shared/angular';
import { ConfigService } from '@biosimulations/config/angular';
import { HealthService } from '@biosimulations/angular-api-client';
import { UpdateService } from '@biosimulations/shared/pwa';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';

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

  public constructor(
    public config: ConfigService,
    private scrollService: ScrollService,
    private updateService: UpdateService,
    private healthService: HealthService,
    private breakpointObserver: BreakpointObserver,
  ) {}

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
}
