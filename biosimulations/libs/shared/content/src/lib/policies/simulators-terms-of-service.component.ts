import { Component } from '@angular/core';
import { ConfigService } from '@biosimulations/shared/services';

@Component({
  selector: 'biosimulations-simulators-terms-of-service',
  templateUrl: './simulators-terms-of-service.component.html',
  styleUrls: ['./simulators-terms-of-service.component.scss'],
})
export class SimulatorsTermsOfServiceComponent {
  emailUrl!: string;
  
  constructor(public config: ConfigService) {
    this.emailUrl = 'mailto:' + config.email;
  }
}
