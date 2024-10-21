import { environmentType } from './environment.type';
import { VERSION } from './version';
import { endpointType } from './endpoint.type';

export const environment: environmentType = {
  production: true,
  env: 'prod',
  baseUrl: 'https://api.biosimulations.org',
  version: VERSION,
};
export const endpoints: endpointType = {
  api: 'https://api.biosimulations.org',
  simulators_api: 'https://api.biosimulators.org',
  combine_api: 'https://combine.api.biosimulations.org',
  simdata_api: 'https://simdata.api.biosimulations.org',
  simulators_app: 'https://biosimulators.org',
  platform_app: 'https://biosimulations.org',
  dispatch_app: 'https://run.biosimulations.org',
  external_api: 'https://api.biosimulations.org',
  external_simulators_api: 'https://api.biosimulators.org',
  external_combine_api: 'https://combine.api.biosimulations.org',
  external_simdata_api: 'https://simdata.api.biosimulations.org',
};
