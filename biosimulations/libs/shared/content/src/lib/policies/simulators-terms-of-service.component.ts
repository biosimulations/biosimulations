import { Component } from '@angular/core';

@Component({
  selector: 'biosimulations-simulators-terms-of-service',
  templateUrl: './simulators-terms-of-service.component.html',
  styleUrls: ['./simulators-terms-of-service.component.scss'],
})
export class SimulatorsTermsOfServiceComponent {  
  // TODO: get from app config
  appName = 'BioSimulators';
  emailUrl = 'mailto:' + 'info@biosimulators.org'
  
  constructor() {}
}
