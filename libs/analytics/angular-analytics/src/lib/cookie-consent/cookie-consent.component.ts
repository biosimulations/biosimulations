import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import {
  APP_NAME_TOKEN,
  Cookie,
  cookieConsentType,
  CookieType,
  FunctionalCookie,
  PerformanceCookie,
  RequiredCookie,
  TrackingCookie,
} from '../datamodel';

@Component({
  selector: 'biosimulations-cookie-consent',
  templateUrl: './cookie-consent.component.html',
  styleUrls: ['./cookie-consent.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CookieConsentComponent {
  public cookies: Cookie[] = [
    new RequiredCookie(),
    new PerformanceCookie(),
    new FunctionalCookie(),
    new TrackingCookie(),
  ];

  public cookieConsent: cookieConsentType = {
    required: true,
    performance: true,
    functionality: true,
    tracking: false,
  };

  public appName: string;
  public constructor(
    public dialogRef: MatDialogRef<CookieConsentComponent, cookieConsentType>,
    @Inject(APP_NAME_TOKEN) appName: string,
  ) {
    this.appName = appName;
  }

  public handleToggleClick(event: Event): void {
    // We do this so that toggling the button does not also open the accordion
    event.stopPropagation();
  }

  public handleToggleChange(type: CookieType, allowed: boolean): void {
    this.cookieConsent[type] = allowed;
  }

  public submitConsent(): void {
    this.dialogRef.close(this.cookieConsent);
  }
}
