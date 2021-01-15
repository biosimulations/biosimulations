import { Component, AfterViewInit } from '@angular/core';
import { ConfigService, ScrollService } from '@biosimulations/shared/services';
import { UpdateService } from '@biosimulations/shared/pwa';
import { timeout } from 'rxjs/operators';

@Component({
  selector: 'biosimulations-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  title = 'dispatch';

  constructor(public config: ConfigService, private scrollService: ScrollService, private update: UpdateService) { }

  ngOnInit() {
    this.update.update()
  }
  ngAfterViewInit(): void {
    this.scrollService.init();




  }
}
