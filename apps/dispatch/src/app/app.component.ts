import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ConfigService, ScrollService, SystemStatusService } from '@biosimulations/shared/services';
import { UpdateService } from '@biosimulations/shared/pwa';
import { Observable } from 'rxjs';

@Component({
  selector: 'biosimulations-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'dispatch';

  status$!: Observable<boolean>;

  constructor(
    public config: ConfigService,
    private scrollService: ScrollService,
    private update: UpdateService,
    private systemStatusService: SystemStatusService,
  ) {}

  ngOnInit(): void {
    this.status$ = this.systemStatusService.getAppStatus();
  }

  ngAfterViewInit(): void {
    this.scrollService.init();
  }
}
