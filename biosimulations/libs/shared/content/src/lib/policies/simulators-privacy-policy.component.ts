import { Component } from '@angular/core';

@Component({
  selector: 'biosimulations-simulators-privacy-policy',
  templateUrl: './simulators-privacy-policy.component.html',
  styleUrls: ['./simulators-privacy-policy.component.scss'],
})
export class SimulatorsPrivacyPolicyComponent {  
  // TODO: get from app config
  appName = 'BioSimulators';
  emailUrl = 'mailto:' + 'info@biosimulators.org'
  
  constructor() {}
}
