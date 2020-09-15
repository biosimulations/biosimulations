import { Component } from '@angular/core';

@Component({
  selector: 'biosimulations-text-page-help-side-bar-section',
  templateUrl: './text-page-help-side-bar-section.component.html',
  styleUrls: ['./text-page-help-side-bar-section.component.scss'],
})
export class TextPageHelpSideBarSectionComponent {
  // TODO: get from app config
  issueUrl = 'https://github.com/biosimulations/Biosimulations/issues/new/choose'
  emailUrl = 'mailto:' + 'info@biosimulators.org'

  constructor() {}
}
