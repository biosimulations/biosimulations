import { Component } from '@angular/core';
import { ConfigService } from '@biosimulations/shared/services';

@Component({
  selector: 'biosimulations-logo-image',
  templateUrl: './logo-image.component.html',
  styleUrls: ['./logo-image.component.scss']
})
export class LogoImageComponent {
  constructor(public config: ConfigService) { }
}
