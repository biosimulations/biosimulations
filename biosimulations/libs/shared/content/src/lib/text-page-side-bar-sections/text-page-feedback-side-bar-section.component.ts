import { Component } from '@angular/core';

@Component({
  selector: 'biosimulations-text-page-feedback-side-bar-section',
  templateUrl: './text-page-feedback-side-bar-section.component.html',
  styleUrls: ['./text-page-feedback-side-bar-section.component.scss'],
})
export class TextPageFeedbackSideBarSectionComponent {
  // TODO: get from app config
  emailUrl = 'mailto:' + 'info@biosimulations.org'

  constructor() {}
}
