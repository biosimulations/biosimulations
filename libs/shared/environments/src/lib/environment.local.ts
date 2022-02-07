import { environmentType } from './environment.type';
import { VERSION } from './version';
export const environment: environmentType = {
  production: false,
  env: 'local',
  baseUrl: 'http://localhost:3333',
  version: VERSION,
};
