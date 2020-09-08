import { Component } from '@angular/core';
import { ConfigService } from '@biosimulations/shared/services';

@Component({
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.sass'],
})
export class HelpComponent {
  constructor(public config: ConfigService) { }
}
