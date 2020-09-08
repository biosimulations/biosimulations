import { Component, OnInit, Input } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ConfigService } from '@biosimulations/shared/services';

@Component({
  selector: 'biosimulations-privacy-policy-notice',
  templateUrl: './privacy-policy-notice.component.html',
  styleUrls: ['./privacy-policy-notice.component.scss'],
})
export class PrivacyPolicyNoticeComponent implements OnInit {
  open = true;
  storageKey!: string;

  constructor(public config: ConfigService, private storage: Storage) {
  }

  public ngOnInit() {
    this.storageKey = 'privacy-policy-notice-' + this.config.appName + '-' + this.config.privacyPolicyVersion.toString() + '-dismissed';

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
