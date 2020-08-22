import { Component, Input } from '@angular/core';

@Component({
  selector: 'biosimulations-privacy-notice',
  templateUrl: './privacy-notice.component.html',
  styleUrls: ['./privacy-notice.component.scss'],
})
export class PrivacyNoticeComponent {
  // TODO: get from app config  
  appName = 'BioSimulations';

  open = true;

  constructor() {}

  close(): void {
    this.open = false;
  }
}
