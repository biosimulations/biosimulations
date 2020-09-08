import { Component } from '@angular/core';
import { ConfigService } from '@biosimulations/shared/services';

@Component({
  selector: 'biosimulations-platform-privacy-policy',
  templateUrl: './platform-privacy-policy.component.html',
  styleUrls: ['./platform-privacy-policy.component.scss'],
})
export class PlatformPrivacyPolicyComponent {
  emailUrl!: string;
    
  constructor(public config: ConfigService) {
    this.emailUrl = 'mailto:' + config.email;
  }
}
