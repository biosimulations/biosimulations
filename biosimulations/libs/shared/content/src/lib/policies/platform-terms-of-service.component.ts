import { Component } from '@angular/core';

@Component({
  selector: 'biosimulations-platform-terms-of-service',
  templateUrl: './platform-terms-of-service.component.html',
  styleUrls: ['./platform-terms-of-service.component.scss'],
})
export class PlatformTermsOfServiceComponent {  
  // TODO: get from app config
  appName = 'BioSimulations';
  emailUrl = 'mailto:' + 'info@biosimulations.org'
  
  constructor() {}
}
