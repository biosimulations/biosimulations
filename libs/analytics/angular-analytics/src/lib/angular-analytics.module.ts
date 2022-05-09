import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService } from './analytics.service';
import { MatDialogModule } from '@angular/material/dialog';
import { CookieConsentComponent } from './cookie-consent/cookie-consent.component';
import { ConsentService } from './consent.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { APP_NAME_TOKEN, ANALYTICS_ID_TOKEN } from './datamodel';

@NgModule({
  imports: [CommonModule, MatDialogModule, MatSlideToggleModule, MatExpansionModule, MatButtonModule],
  providers: [AnalyticsService],
  declarations: [CookieConsentComponent],
})
export class AngularAnalyticsModule {
  public constructor(
    // Needs to be imported so DI can do its thing and run the constructors
    private consentService: ConsentService,
    private analyticsService: AnalyticsService,
  ) {}

  public static forRoot(appName: string, analyticsId: string): ModuleWithProviders<AngularAnalyticsModule> {
    return {
      ngModule: AngularAnalyticsModule,
      providers: [
        { provide: APP_NAME_TOKEN, useValue: appName },
        { provide: ANALYTICS_ID_TOKEN, useValue: analyticsId },
      ],
    };
  }
}
