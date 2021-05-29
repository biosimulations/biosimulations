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
  set appName(value: string | undefined) {
    this._appName = value;
    this.initStorage();
  }

  get appName(): string | undefined {
    return this._appName;
  }

  private _type?: string;

  @Input()
  set type(value: string | undefined) {
    this._type = value;
    this.initStorage();
  }

  get type(): string | undefined {
    return this._type;
  }

  private _version?: number;

  @Input()
  set version(value: number | undefined) {
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
    if (
      this._appName === undefined ||
      this._type === undefined ||
      this._version === undefined
    ) {
      return;
    }

    this.storage.ready().then((): void => {
      this.storageKey = [
        'notice',
        this._appName as string,
        this._type as string,
        (this._version as number).toString(),
        'dismissed',
      ].join('-');

      if (this.open) {
        this.storage
          .get(this.storageKey)
          .then((value: boolean | null): void => {
            if (value === true) {
              this.open = false;
            }
          });
      } else {
        this.storage.set(this.storageKey, true);
      }
    });
  }

  close(): void {
    this.open = false;
    if (this.storageKey !== undefined) {
      this.storage.set(this.storageKey, true);
    }
  }
}
