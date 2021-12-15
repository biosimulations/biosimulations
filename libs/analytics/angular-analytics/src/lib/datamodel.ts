export interface Consent {
  ad_storage: 'granted' | 'denied';
  analytics_storage: 'granted' | 'denied';
}

export interface ConsentRecord {
  consent: Consent;
  date: string;
}
