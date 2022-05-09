/**
 * @File this is the internal datamodel for the consent/analytics service.
 * In general, nothing from here should be exported from the library
 */

export const APP_NAME_TOKEN = Symbol('APP_NAME_TOKEN');
export const ANALYTICS_ID_TOKEN = Symbol('ANALYTICS_ID_TOKEN');
export interface Consent {
  ad_storage: 'granted' | 'denied';
  analytics_storage: 'granted' | 'denied';
}

export interface ConsentRecord {
  consent: Consent;
  date: string;
}
// https://gdpr.eu/cookies/
export type CookieType = 'required' | 'performance' | 'functionality' | 'tracking';

export enum CookieTypes {
  required = 'required',
  performance = 'performance',
  functionality = 'functionality',
  tracking = 'tracking',
}
export interface Cookie {
  type: CookieType;
  description: string;
  externalLink: string;
  displayName: string;
  toggleAllowed: boolean;
  toggleDisabled: boolean;
}

export class RequiredCookie implements Cookie {
  public type = CookieTypes.required;
  public description =
    'These cookies are essential for the website to function correctly.\
     These cookies are first party cookies that contain no personal information.\
     Examples include cookies that store your consent to the use of cookies or security cookies.';
  public externalLink = 'https://docs.biosimulations.org/about/cookies#neccesary-cookies';
  public displayName = 'Necessary cookies';
  public toggleAllowed = true;
  public toggleDisabled = true;
}

export class PerformanceCookie implements Cookie {
  public type = CookieTypes.performance;
  public description =
    'These cookies collect anonymous information about your use of the website.\
    They are first party cookies that collect information such as which pages you visit,\
    which features you use, and which links you click.\
    This information is aggregated and anonymized and cannot be traced to you individually.';
  public externalLink = 'https://docs.biosimulations.org/about/cookies#performance-cookies';
  public displayName = 'Performance cookies';
  public toggleAllowed = true;
  public toggleDisabled = false;
}

export class FunctionalCookie implements Cookie {
  public type = CookieTypes.functionality;
  public description =
    'These cookies are used to provide you with a more personalized experience.\
  They are first party cookies that contain information about your preferences.\
  Examples include cookies that remember your recent searches or keep you logged in.\
  These cookies do not contain any personal information.';
  public externalLink = 'https://docs.biosimulations.org/about/cookies#functional-cookies';
  public displayName = 'Functional cookies';
  public toggleAllowed = true;
  public toggleDisabled = false;
}

export class TrackingCookie implements Cookie {
  public type = CookieTypes.tracking;
  public description =
    'These cookies are generally third-party cookies that are used to track your online activity and behavior for marketing and advertising purposes.\
  We DO NOT USE any tracking cookies or third-party services to track your online activity and behavior.';
  public externalLink = 'https://docs.biosimulations.org/about/cookies#tracking-cookies';
  public displayName = 'Tracking cookies';
  public toggleAllowed = false;
  public toggleDisabled = true;
}

export type cookieConsentType = { [key in CookieType]: boolean };
