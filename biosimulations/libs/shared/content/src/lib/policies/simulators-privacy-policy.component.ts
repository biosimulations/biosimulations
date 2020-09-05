import { Component } from '@angular/core';
import { ConfigService } from '@biosimulations/shared/services';

@Component({
  selector: 'biosimulations-simulators-privacy-policy',
  templateUrl: './simulators-privacy-policy.component.html',
  styleUrls: ['./simulators-privacy-policy.component.scss'],
})
export class SimulatorsPrivacyPolicyComponent {  
  emailUrl!: string;
  
  constructor(public config: ConfigService) {
    this.emailUrl = 'mailto:' + config.email;
  }
}
