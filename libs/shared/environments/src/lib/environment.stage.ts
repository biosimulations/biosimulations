import { environmentType } from './environment.type';
import { VERSION } from './version';
export const environment: environmentType = {
  production: true,
  env: 'stage',
  baseUrl: 'https://api.biosimulations.dev',
  version: VERSION,
};
