import { Component, Input } from '@angular/core';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'biosimulations-privacy-policy-notice',
  templateUrl: './privacy-policy-notice.component.html',
  styleUrls: ['./privacy-policy-notice.component.scss'],
})
export class PrivacyPolicyNoticeComponent {
  private _appName!: string;

  @Input()
  set appName (value: string) {
    this._appName = value;
    this.initStorage();
  }

  get appName (): string {
    return this._appName;
  }

  private _policyVersion!: number;

  @Input()
  set policyVersion (value: number) {
    this._policyVersion = value;
    this.initStorage();
  }

  get policyVersion(): number {
    return this._policyVersion;
  }

  open = true;
  storageKey!: string;

  constructor(private storage: Storage) {}

  initStorage() {
    if (this._appName === undefined || this._policyVersion === undefined) {
      return;
    }

    this.storageKey = 'privacy-policy-notice-' + this._appName + '-' + this._policyVersion.toString() + '-dismissed';

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
