import { Component } from '@angular/core';

@Component({
  selector: 'privacy-notice',
  templateUrl: './privacy-notice.component.html',
  styleUrls: ['./privacy-notice.component.scss'],
})
export class PrivacyNoticeComponent {
  open = true;
  appName = 'BioSimulations'; // TODO: import name of current app (e.g., BioSimulations or BioSimulators)

  constructor() {}

  close(): void {
    this.open = false;
  }
}
