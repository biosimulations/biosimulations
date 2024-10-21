import { environmentType } from './environment.type';
import { endpointType } from './endpoint.type';
import { VERSION } from './version';

export const environment: environmentType = {
  production: false,
  env: 'dev',
  baseUrl: 'https://api.biosimulations.dev',
  version: VERSION,
};
export const endpoints: endpointType = {
  api: 'https://api.biosimulations.dev',
  simulators_api: 'https://api.biosimulators.dev',
  combine_api: 'https://combine.api.biosimulations.dev',
  simdata_api: 'https://simdata.api.biosimulations.dev',
  simulators_app: 'https://biosimulators.dev',
  platform_app: 'https://biosimulators.dev',
  dispatch_app: 'https://run.biosimulations.dev',
  external_api: 'https://api.biosimulations.dev',
  external_simulators_api: 'https://api.biosimulators.dev',
  external_combine_api: 'https://combine.api.biosimulations.dev',
  external_simdata_api: 'https://simdata.api.biosimulations.dev',
};
