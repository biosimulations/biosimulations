import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ScrollService } from '@biosimulations/shared/angular';
import { ConfigService } from '@biosimulations/config/angular';
import { HealthService } from './services/health/health.service';
import { UpdateService } from '@biosimulations/shared/pwa';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';

@Component({
  selector: 'biosimulations-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  public title = 'simulators';
  public healthy$!: Observable<boolean>;
  public isMobileSimulators = false;

  public constructor(
    public config: ConfigService,
    private scrollService: ScrollService,
    private updateService: UpdateService,
    private healthService: HealthService,
    private observer: BreakpointObserver,
  ) {}

  public ngOnInit(): void {
    this.healthy$ = this.healthService.isHealthy();
    this.checkClientScreenSimulators();
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
