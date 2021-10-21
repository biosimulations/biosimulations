import { Component, AfterViewInit } from '@angular/core';
import { ConfigService, ScrollService } from '@biosimulations/shared/angular';

@Component({
  selector: 'biosimulations-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  title = 'platform';
  constructor(
    public config: ConfigService,
    private scrollService: ScrollService,
  ) {}

  ngAfterViewInit(): void {
    this.scrollService.init();
  }
}
