import { Component, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent implements OnInit {
  title = 'BioSimulations';

  constructor(private logger: NGXLogger) {}
  ngOnInit() {
    this.logger.debug('App Loaded');
  }
}
