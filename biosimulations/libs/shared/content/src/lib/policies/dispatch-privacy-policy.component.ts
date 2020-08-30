import { Component } from '@angular/core';

@Component({
  selector: 'biosimulations-dispatch-privacy-policy',
  templateUrl: './dispatch-privacy-policy.component.html',
  styleUrls: ['./dispatch-privacy-policy.component.scss'],
})
export class DispatchPrivacyPolicyComponent {  
  // TODO: get from app config
  appName = 'runBioSimulators';
  emailUrl = 'mailto:' + 'info@biosimulators.org'
  
  constructor() {}
}
