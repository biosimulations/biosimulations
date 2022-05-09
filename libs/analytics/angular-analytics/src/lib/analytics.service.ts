/**
 * @ File - analytics.service.ts - Client to google analytics. Automatically manages consent.
 * @ Author -Bilal Shaikh
 * Inspired heavily by https://www.dottedsquirrel.com/google-analytics-angular/
 */
import { Inject, Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { ConsentService } from './consent.service';
import { ANALYTICS_ID_TOKEN, Consent } from './datamodel';

// eslint-disable-next-line @typescript-eslint/ban-types
declare let gtag: Function;
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/ban-types
    gtag: typeof gtag;
    dataLayer: any[];
  }
}
@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private routerSubscription: Subscription | null = null;
  private initPageView = false;
  private analyticsId: string;
  public constructor(
    public router: Router,
    private route: ActivatedRoute,
    @Inject(ANALYTICS_ID_TOKEN) private analyticsIdToken: string,

    private consentService: ConsentService,
  ) {
    this.analyticsId = analyticsIdToken;
    // Make sure any changes are properly reflected in the privacy policy/cookie policy.
    // Ordering is important here.

    // This should be first so we don't store any cookies until/unless we get consent
    this.consentService.consent$.pipe().subscribe((consent: Consent) => {
      // Basic set up of google analytics, but needs to have the above declarations for typescript to be happy

      const s = document.createElement('script');
      s.setAttribute('src', `https://www.googletagmanager.com/gtag/js?id=${this.analyticsId}`);
      s.async = true;
      document.head.appendChild(s);

      window.dataLayer = window.dataLayer || [];

      // This must not be changes to an arrow function bc arrow functions do not have "arguments"
      window.gtag = function () {
        // eslint-disable-next-line prefer-rest-params
        window.dataLayer.push(arguments);
      };

      // init google analytics
      gtag('js', new Date());

      // make sure consent is first. This should be the first call made to "gtag" function (after init above)
      gtag('consent', 'update', consent);

      // Disable all advertising/tracking
      gtag('set', 'allow_google_signals', false);

      const send_pageview = consent.analytics_storage === 'granted';
      this.init(send_pageview);

      gtag('event', 'consent_recorded', {
        eventValue: consent.analytics_storage,
        eventLabel: 'consent_recorded',
      });
    });
  }

  public async init(sendPageView: boolean): Promise<void> {
    // page views will be handled by analytics service. Give cookies clear names to ref in privacy policy.

    gtag('config', this.analyticsId, {
      send_page_view: false,
      cookie_prefix: 'biosim_analytics',
      link_attribution: {
        enabled: true,
        cookie_name: 'biosim_analytics_la',
      },
    });

    // Only want to have one subscription to the router
    if (!this.routerSubscription) {
      this.routerSubscription = this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          gtag('set', 'page_location', event.urlAfterRedirects);
          // TODO get info from activated route
          gtag('event', 'page_view');
        }
      });
    }
    // Only send page view once when module loads
    if (sendPageView && !this.initPageView) {
      gtag('event', 'page_view');
      this.initPageView = true;
    }
  }

  // https://developers.google.com/analytics/devguides/collection/gtagjs/events
  //https://support.google.com/analytics/answer/1033068#Anatomy&zippy=%2Cin-this-article
  public pageviewEmitter(page_location: string, page_path: string, page_title: string): void {
    gtag('page_view', {
      page_location,
      page_path,
      page_title,
    });
  }

  public eventEmitter(
    eventName: string,
    eventCategory: EventCategory,
    eventAction: string,
    eventLabel: string | null = null,
    eventValue: number | null = null,
    nonInteraction: boolean = false,
  ): void {
    gtag('event', eventName, {
      eventCategory: eventCategory,
      eventLabel: eventLabel,
      eventAction: eventAction,
      value: eventValue,
      non_interaction: nonInteraction,
    });
  }
}
type EventCategory = 'engagement' | 'custom';
