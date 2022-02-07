import { environmentType } from './environment.type';
import { VERSION } from './version';
export const environment: environmentType = {
  production: true,
  env: 'prod',
  baseUrl: 'https://api.biosimulations.org',
  version: VERSION,
};
