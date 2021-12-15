import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'biosimulations-cookie-consent',
  templateUrl: './cookie-consent.component.html',
  styleUrls: ['./cookie-consent.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CookieConsentComponent {
  public performanceCookies = true;
  public functionalCookies = true;
  public necessaryCookiesDescription = 'We need these';
  public necessaryCookiesDocsURL =
    'https://www.biosimulations.org/cookies#neccesary-cookies';
  public performanceCookiesDescription = 'We want these';
  public performanceCookiesDocsURL =
    'https://www.biosimulations.org/cookies#performance-cookies';
  public functionalCookiesDescription = 'You probably want these';
  public functionalCookiesDocsURL =
    'https://www.biosimulations.org/cookies#functional-cookies';
  public trackingCookiesDescription = 'We never use these';
  public trackingCookiesDocsUrl =
    'https://www.biosimulations.org/cookies#tracking-cookies';

  public constructor(public dialogRef: MatDialogRef<CookieConsentComponent>) {}

  public changePerf(event: MatSlideToggleChange): void {
    this.performanceCookies = event.checked;
  }
  public changeFunc(event: MatSlideToggleChange): void {
    this.functionalCookies = event.checked;
  }
  public handleToggleClick(event: Event): void {
    // We do this so that toggling the button does not also open the accordion
    event.stopPropagation();
  }

  public submitConsent(): void {
    this.dialogRef.close({
      performanceCookies: this.performanceCookies,
      functionalCookies: this.functionalCookies,
    });
  }
}
