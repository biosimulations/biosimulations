export enum License {
  cc0 = 'CC0',
  cc_by = 'CC BY',
  cc_by_sa = 'CC BY-SA',
  cc_by_nc = 'CC BY-NC',
  cc_by_nc_sa = 'CC BY-NC-SA',
  mit = 'MIT',
  apache_1 = 'Apache 1.0',
  apache_1_1 = 'Apache 1.1',
  apache_2 = 'Apache 2.0',
  artistic_1 = 'Artistic 1.0',
  artistic_2 = 'Artistic 2.0',
  other = 'Other',
}

export interface LicenseInfo {
  value: License;
  name: string;
  version: string | null;
  swoId: number | null;
  url: string | null;
}
