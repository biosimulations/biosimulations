import { Component, Input } from '@angular/core';

@Component({
  selector: 'privacy-notice',
  templateUrl: './privacy-notice.component.html',
  styleUrls: ['./privacy-notice.component.scss'],
})
export class PrivacyNoticeComponent {
  open = true;

  @Input()
  appName = '';

  constructor() {}

  close(): void {
    this.open = false;
  }
}
