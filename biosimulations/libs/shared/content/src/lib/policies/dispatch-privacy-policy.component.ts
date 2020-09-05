import { Component } from '@angular/core';
import { ConfigService } from '@biosimulations/shared/services';

@Component({
  selector: 'biosimulations-dispatch-privacy-policy',
  templateUrl: './dispatch-privacy-policy.component.html',
  styleUrls: ['./dispatch-privacy-policy.component.scss'],
})
export class DispatchPrivacyPolicyComponent {
  emailUrl!: string;
    
  constructor(public config: ConfigService) {
    this.emailUrl = 'mailto:' + config.email;
  }
}
