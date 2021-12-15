import {
  Component,
  ChangeDetectionStrategy,
} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ConfigService } from '@biosimulations/config/angular';
import {
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
    private config: ConfigService,
  ) {
    this.appName = config.appName;
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
