import { Component, Input } from '@angular/core';

@Component({
  selector: 'biosimulations-privacy-notice',
  templateUrl: './privacy-notice.component.html',
  styleUrls: ['./privacy-notice.component.scss'],
})
export class PrivacyNoticeComponent {
  open = true;

  @Input()
  appName = 'Biosimulations';

  constructor() {}

  close(): void {
    this.open = false;
  }
}
