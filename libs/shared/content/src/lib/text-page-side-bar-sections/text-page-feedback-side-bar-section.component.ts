import { Component } from '@angular/core';
import { ConfigService } from '@biosimulations/shared/services';

@Component({
  selector: 'biosimulations-text-page-feedback-side-bar-section',
  templateUrl: './text-page-feedback-side-bar-section.component.html',
  styleUrls: ['./text-page-feedback-side-bar-section.component.scss'],
})
export class TextPageFeedbackSideBarSectionComponent {
  emailUrl!: string;

  constructor(public config: ConfigService) {
    this.emailUrl = 'mailto:' + config.email;
  }
}
