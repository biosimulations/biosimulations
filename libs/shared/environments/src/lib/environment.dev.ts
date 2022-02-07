import { environmentType } from './environment.type';
import { VERSION } from './version';
export const environment: environmentType = {
  production: false,
  env: 'dev',
  baseUrl: 'https://api.biosimulations.dev',
  version: VERSION,
};
