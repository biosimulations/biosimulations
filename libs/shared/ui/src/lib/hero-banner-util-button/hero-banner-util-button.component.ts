import { Component, Input } from '@angular/core';

@Component({
  selector: 'biosimulations-hero-banner-util-button',
  templateUrl: './hero-banner-util-button.component.html',
  styleUrls: ['./hero-banner-util-button.component.scss'],
})
export class HeroBannerUtilButtonComponent {
  @Input() public validateSimulatorUrl?: string;
  @Input() public apiUrl?: string;
  public routerLinkMenuConfig = [
    { heading: 'Convert a file', routerLink: ['/utils', 'convert-file'] },
    { heading: 'Create a project', routerLink: ['/utils', 'create-project'] },
    { heading: 'Validate a model', routerLink: ['/utils', 'validate-model'] },
    { heading: 'Validate a simulation', routerLink: ['/utils', 'validate-simulation'] },
    { heading: 'Validate metadata', routerLink: ['/utils', 'validate-metadata'] },
    { heading: 'Validate a project', routerLink: ['/utils', 'validate-project'] },
    { heading: 'Suggest a simulator', routerLink: ['/utils', 'suggest-simulator'] },
  ];
}
