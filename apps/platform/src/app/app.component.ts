import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ConfigService, ScrollService } from '@biosimulations/shared/angular';
import { HealthService } from '@biosimulations/angular-api-client';
import { UpdateService } from '@biosimulations/shared/pwa';
import { Observable } from 'rxjs';

@Component({
  selector: 'biosimulations-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'platform';

  healthy$!: Observable<boolean>;

  constructor(
    public config: ConfigService,
    private scrollService: ScrollService,
    private updateService: UpdateService,
    private healthService: HealthService,
  ) {}

  ngOnInit(): void {
    this.healthy$ = this.healthService.isHealthy();
  }

  ngAfterViewInit(): void {
    this.scrollService.init();
  }
}
