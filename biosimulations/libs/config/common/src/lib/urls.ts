import { environment } from '@biosimulations/shared/environments';

const fetchSimulatorsURL =
  'https://hub.docker.com/v2/repositories/biosimulators/?page_size=25&page=1&ordering=last_updated';

export type appName =
  | 'platformApi'
  | 'accountApi'
  | 'dispatchApi'
  | 'simulatorsApi'
  | 'platform'
  | 'account'
  | 'dispatch'
  | 'simulators'
  | 'fetchSimulatorsInfo';

export type envs = 'prod' | 'dev' | 'local' | 'stage';

export type urlMap = { [key in appName]: string };

const envUrls: { [key in envs]: urlMap } = {
  prod: {
    platformApi: 'https://api.biosimulations.dev/',
    accountApi: 'https://account.biosimulations.dev/',
    dispatchApi: 'https://dispatch.biosimulations.dev/',
    simulatorsApi: 'https://api.biosimulations.dev/',
    platform: 'https://biosimulations.dev',
    account: 'https://login.biosimulations.dev',
    dispatch: 'https://submit.biosimulations.dev',
    simulators: 'https://biosimulators.org',
    fetchSimulatorsInfo: fetchSimulatorsURL,
  },
  dev: {
    platformApi: 'https://api.biosimulations.dev/',
    accountApi: 'https://account.biosimulations.dev/',
    dispatchApi: '/api',
    simulatorsApi: 'https://api.biosimulations.dev/',
    platform: 'https://biosimulations.dev',
    account: 'https://login.biosimulations.dev',
    dispatch: 'https://submit.biosimulations.dev',
    simulators: 'https://biosimulators.org',
    fetchSimulatorsInfo: fetchSimulatorsURL,
  },
  stage: {
    platformApi: 'https://api.biosimulations.dev/',
    accountApi: 'https://account.biosimulations.dev/',
    dispatchApi: 'https://dispatch.biosimulations.dev/api',
    simulatorsApi: 'https://api.biosimulations.dev/',
    platform: 'https://biosimulations.dev',
    account: 'https://login.biosimulations.dev',
    dispatch: 'https://submit.biosimulations.dev',
    simulators: 'https://biosimulators.org',
    fetchSimulatorsInfo: fetchSimulatorsURL,
  },
  local: {
    platformApi: '/api/', //proxies to localhost:3333 if using nx
    accountApi: '/api/',
    dispatchApi: '/api/',
    simulatorsApi: '/api/',
    platform: 'https://biosimulations.dev',
    account: 'https://login.biosimulations.dev',
    dispatch: 'https://submit.biosimulations.dev',
    simulators: 'https://biosimulators.org',
    fetchSimulatorsInfo: fetchSimulatorsURL,
  },
};

export const urls: urlMap = envUrls[environment.env as envs];
