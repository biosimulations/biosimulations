/**
 * @ File - analytics.service.ts - Client to google analytics. Automatically manages consent.
 * @ Author -Bilal Shaikh
 * Inspired heavily by https://www.dottedsquirrel.com/google-analytics-angular/
 */
import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ConfigService } from '@biosimulations/config/angular';
import { Subscription } from 'rxjs';
import { ConsentService } from './consent.service';
import { Consent } from './datamodel';

// eslint-disable-next-line @typescript-eslint/ban-types
declare let gtag: Function;
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
    private config: ConfigService,

    private consentService: ConsentService,
  ) {
    this.analyticsId = this.config.analyticsId;
    // Make sure any changes are properly reflected in the privacy policy/cookie policy.
    // Ordering is important here.

    // This should be first so we don't store any cookies until/unless we get consent
    this.consentService.consent$.pipe().subscribe((consent: Consent) => {
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

    console.error('init');
    gtag('config', this.analyticsId, {
      send_page_view: false,
      cookie_prefix: 'goog_analytics_perf_',
      link_attribution: {
        cookie_name: 'goog_analytics_la_perf',
      },
    });

    // Only want to have one subscription to the router
    if (!this.routerSubscription) {
      console.error('subscribe');
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
  public pageviewEmitter(
    page_location: string,
    page_path: string,
    page_title: string,
  ): void {
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
