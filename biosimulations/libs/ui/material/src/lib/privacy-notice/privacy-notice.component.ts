import { Component } from '@angular/core';

@Component({
  selector: 'privacy-notice',
  templateUrl: './privacy-notice.component.html',
  styleUrls: ['./privacy-notice.component.scss'],
})
export class PrivacyNoticeComponent {
  open: boolean = true;

  constructor() {}

  close(): void {
    this.open = false;
  }
}
