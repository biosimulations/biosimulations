import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ConfigService, ScrollService, SystemStatusService } from '@biosimulations/shared/services';
import { SystemService } from '@biosimulations/datamodel/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'biosimulations-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'simulators';

  status$!: Observable<boolean>;

  constructor(
    public config: ConfigService,
    private scrollService: ScrollService,
    private systemStatusService: SystemStatusService,
  ) {}

  ngOnInit(): void {
    this.status$ = this.systemStatusService.getAppStatus([
      'bio-simulators-api',
      'ingress-loadbalancer',
      ] as SystemService[]);
  }

  ngAfterViewInit(): void {
    this.scrollService.init();
  }
}
