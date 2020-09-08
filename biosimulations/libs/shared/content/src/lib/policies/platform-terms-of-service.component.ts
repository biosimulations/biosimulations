import { Component } from '@angular/core';
import { ConfigService } from '@biosimulations/shared/services';

@Component({
  selector: 'biosimulations-platform-terms-of-service',
  templateUrl: './platform-terms-of-service.component.html',
  styleUrls: ['./platform-terms-of-service.component.scss'],
})
export class PlatformTermsOfServiceComponent {  
  emailUrl!: string;

  constructor(public config: ConfigService) {
    this.emailUrl = 'mailto:' + config.email;
  }
}
