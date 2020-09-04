import { Component, OnInit, Input } from '@angular/core';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'biosimulations-privacy-policy-notice',
  templateUrl: './privacy-policy-notice.component.html',
  styleUrls: ['./privacy-policy-notice.component.scss'],
})
export class PrivacyPolicyNoticeComponent implements OnInit {
  // TODO: get from app config  
  appName = 'BioSimulations';
  privacyPolicyVersion = 1;
  open = true;
  storageKey!: string;

  constructor(private storage: Storage) {
  }

  public ngOnInit() {
    this.storageKey = 'privacy-policy-notice-' + this.appName + '-' + this.privacyPolicyVersion.toString() + '-dismissed';

    this.storage.ready().then(() => {
      this.storage.keys().then((keys) => {
        if (keys.includes(this.storageKey)) {
          this.open = false;
        }
      });
    });
  }

  close(): void {
    this.open = false;
    this.storage.set(this.storageKey, true);
  }
}
