import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ConfigService, ScrollService, HealthService } from '@biosimulations/shared/services';
import { Observable } from 'rxjs';
import { Endpoints } from '@biosimulations/config/common';

@Component({
  selector: 'biosimulations-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  private endpoints = new Endpoints();

  title = 'simulators';

  healthy$!: Observable<boolean>;

  constructor(
    public config: ConfigService,
    private scrollService: ScrollService,
    private healthService: HealthService,
  ) {}

  ngOnInit(): void {
    const isHealthyEndpoint = this.endpoints.getIsHealthyEndpoint('simulators');
    this.healthy$ = this.healthService.isHealthy(isHealthyEndpoint);
  }

  ngAfterViewInit(): void {
    this.scrollService.init();
  }
}
