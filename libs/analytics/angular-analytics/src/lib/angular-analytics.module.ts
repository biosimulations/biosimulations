import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService } from './analytics.service';
import { MatDialogModule } from '@angular/material/dialog';
import { CookieConsentComponent } from './cookie-consent/cookie-consent.component';
import { ConsentService } from './consent.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatExpansionModule,
    MatButtonModule,
  ],
  providers: [AnalyticsService],
  declarations: [CookieConsentComponent],
  exports: [CookieConsentComponent],
})
export class AngularAnalyticsModule {
  constructor(
    private consentService: ConsentService,
    // Needs to be imported so DI can do its thing and run the constructor
    private analyticsService: AnalyticsService,
  ) {
    this.consentService.initConsent();
  }
}
