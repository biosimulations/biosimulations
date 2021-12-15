/**
 * @ File - analytics.service.ts - Client to google analytics.
 * TODO : Manages consent automatically.
 *
 * @ Author -Bilal Shaikh
 * Inspired heavily by https://www.dottedsquirrel.com/google-analytics-angular/
 */
import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ConsentService } from './consent.service';
import { Consent } from './datamodel';

// eslint-disable-next-line @typescript-eslint/ban-types
declare let gtag: Function;
@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  public constructor(
    public router: Router,
    private consentService: ConsentService,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        gtag('set', 'page', event.urlAfterRedirects);
        gtag('send', 'pageview');
      }
    });

    this.consentService.consent$.subscribe((consent: Consent) => {
      gtag('consent', 'update', consent);
    });
  }

  public eventEmitter(
    eventName: string,
    eventCategory: string,
    eventAction: string,
    eventLabel: string | null = null,
    eventValue: number | null = null,
  ) {
    gtag('event', eventName, {
      eventCategory: eventCategory,
      eventLabel: eventLabel,
      eventAction: eventAction,
      eventValue: eventValue,
    });
  }
}
