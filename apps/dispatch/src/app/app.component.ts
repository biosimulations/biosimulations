import { Component, AfterViewInit } from '@angular/core';
import { ConfigService, ScrollService } from '@biosimulations/shared/angular';
import { UpdateService } from '@biosimulations/shared/pwa';

@Component({
  selector: 'biosimulations-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  title = 'dispatch';

  constructor(
    public config: ConfigService,
    private scrollService: ScrollService,
    private update: UpdateService,
  ) {}

  ngAfterViewInit(): void {
    this.scrollService.init();
  }
}
