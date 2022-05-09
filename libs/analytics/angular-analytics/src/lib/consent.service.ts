import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Consent, ConsentRecord, cookieConsentType } from './datamodel';
import { Storage } from '@ionic/storage-angular';

import { CookieConsentComponent } from './cookie-consent/cookie-consent.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class ConsentService {
  private defaultConsentVal: Consent = {
    ad_storage: 'denied',
    analytics_storage: 'denied',
  };
  private consent: BehaviorSubject<Consent> = new BehaviorSubject(this.defaultConsentVal);
  public readonly consent$: Observable<Consent> = this.consent.asObservable();

  public constructor(private browserStorage: Storage, public dialog: MatDialog) {
    this.initConsent();
  }

  public async initConsent() {
    const storage = await this.browserStorage.create();
    const storageKey = 'consented';
    const consented = (await storage.get(storageKey)) as ConsentRecord | undefined;

    const LAST_VALID_CONSENT_DATE = '2021-12-01';
    if (consented && new Date(consented.date) > new Date(LAST_VALID_CONSENT_DATE)) {
      this.consent.next(consented.consent);
    } else {
      this.startConsentFlow();
    }
  }

  private startConsentFlow(): void {
    const dialogRef: MatDialogRef<CookieConsentComponent, cookieConsentType> = this.dialog.open(
      CookieConsentComponent,
      {
        hasBackdrop: true,
        maxWidth: 'min(900px, calc(100vw - 1.5rem))',
        maxHeight: 'min(900px, calc(100vh - 2rem))',
        disableClose: true,
        closeOnNavigation: false,
      },
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.performance) {
        const consentRecord: ConsentRecord = {
          date: new Date().toISOString(),
          consent: {
            ad_storage: 'denied',
            analytics_storage: 'granted',
          },
        };
        this.browserStorage.set('consented', consentRecord);

        this.consent.next(consentRecord.consent);
      } else {
        this.browserStorage.set('consented', {
          date: new Date().toISOString(),
          consent: this.defaultConsentVal,
        });
        this.consent.next(this.defaultConsentVal);
      }
    });
  }
}
