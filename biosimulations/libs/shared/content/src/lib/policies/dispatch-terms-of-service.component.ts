import { Component } from '@angular/core';
import { ConfigService } from '@biosimulations/shared/services';

@Component({
  selector: 'biosimulations-dispatch-terms-of-service',
  templateUrl: './dispatch-terms-of-service.component.html',
  styleUrls: ['./dispatch-terms-of-service.component.scss'],
})
export class DispatchTermsOfServiceComponent {  
  emailUrl!: string;
  
  constructor(public config: ConfigService) {
    this.emailUrl = 'mailto:' + config.email;
  }
}
