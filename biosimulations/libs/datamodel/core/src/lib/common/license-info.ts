import { License } from '../enums/licence';

export interface LicenseInfo {
  value: License;
  name: string;
  version: string;
  swoId: number;
  url: string;
}
