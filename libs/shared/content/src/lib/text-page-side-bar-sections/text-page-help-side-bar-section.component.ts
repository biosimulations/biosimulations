import { Component } from '@angular/core';
import { ConfigService } from '@biosimulations/shared/angular';

@Component({
  selector: 'biosimulations-text-page-help-side-bar-section',
  templateUrl: './text-page-help-side-bar-section.component.html',
  styleUrls: ['./text-page-help-side-bar-section.component.scss'],
})
export class TextPageHelpSideBarSectionComponent {
  emailUrl!: string;
  tutorialsUrl!: string | null;

  constructor(public config: ConfigService) {
    this.emailUrl = 'mailto:' + config.email;
    this.tutorialsUrl = config.tutorialsUrl;
  }
}
