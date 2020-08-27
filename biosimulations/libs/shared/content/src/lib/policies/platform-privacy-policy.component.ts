import { Component } from '@angular/core';

@Component({
  selector: 'biosimulations-platform-privacy-policy',
  templateUrl: './platform-privacy-policy.component.html',
  styleUrls: ['./platform-privacy-policy.component.scss'],
})
export class PlatformPrivacyPolicyComponent {  
  // TODO: get from app config
  appName = 'BioSimulations';
  emailUrl = 'mailto:' + 'info@biosimulations.org'
  
  constructor() {}
}
