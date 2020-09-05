import { Component } from '@angular/core';

@Component({
  selector: 'biosimulations-dispatch-terms-of-service',
  templateUrl: './dispatch-terms-of-service.component.html',
  styleUrls: ['./dispatch-terms-of-service.component.scss'],
})
export class DispatchTermsOfServiceComponent {  
  // TODO: get from app config
  appName = 'runBioSimulations';
  emailUrl = 'mailto:' + 'info@biosimulations.org'
  
  constructor() {}
}
