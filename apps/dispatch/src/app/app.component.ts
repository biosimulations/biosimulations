import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ScrollService } from '@biosimulations/shared/angular';
import { ConfigService } from '@biosimulations/config/angular';
import { HealthService } from '@biosimulations/angular-api-client';
import { UpdateService } from '@biosimulations/shared/pwa';
import { Observable } from 'rxjs';

@Component({
  selector: 'biosimulations-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  public title = 'dispatch';

  public healthy$!: Observable<boolean>;

  public constructor(
    public config: ConfigService,
    private scrollService: ScrollService,
    private updateService: UpdateService,
    private healthService: HealthService,
  ) {}

  public ngOnInit(): void {
    this.healthy$ = this.healthService.isHealthy();
  }

  public ngAfterViewInit(): void {
    this.scrollService.init();
  }
}
