import { Component, Input } from '@angular/core';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'biosimulations-notice',
  templateUrl: './notice.component.html',
  styleUrls: ['./notice.component.scss'],
})
export class NoticeComponent {
  private _appName?: string;

  @Input()
  set appName (value: string | undefined) {
    this._appName = value;
    this.initStorage();
  }

  get appName (): string | undefined {
    return this._appName;
  }

  private _type?: string;

  @Input()
  set type (value: string | undefined) {
    this._type = value;
    this.initStorage();
  }

  get type(): string | undefined {
    return this._type;
  }

  private _version?: number;

  @Input()
  set version (value: number | undefined) {
    this._version = value;
    this.initStorage();
  }

  get version(): number | undefined {
    return this._version;
  }

  open = true;
  storageKey?: string;

  constructor(private storage: Storage) {}

  initStorage(): void {
    if (this._appName === undefined || this._type === undefined || this._version === undefined) {
      return;
    }

    this.storageKey = 'notice-' + this._appName + '-' + this._type + '-' + this._version.toString() + '-dismissed';

    this.storage.ready().then((): void => {
      this.storage.keys().then((keys): void => {
        if (keys.includes(this.storageKey as string)) {
          this.open = false;
        }
      });
    });
  }

  close(): void {
    this.open = false;
    if (this.storageKey !== undefined) {
      this.storage.set(this.storageKey, true);
    }
  }
}
