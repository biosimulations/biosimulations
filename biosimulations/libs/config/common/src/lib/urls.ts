import { environment } from '@biosimulations/shared/environments';

const fetchSimulatorsURL = 'https://hub.docker.com/v2/repositories/biosimulators/?page_size=25&page=1&ordering=last_updated'

export type appName =
  | 'platformApi'
  | 'accountApi'
  | 'dispatchApi'
  | 'simulatorApi'
  | 'fetchSimulatorsInfo';

export type envs = 'prod' | 'dev' | 'local' | 'stage';

export type urlMap = { [key in appName]: string };

const envUrls: { [key in envs]: urlMap } = {
  prod: {
    platformApi: 'https://api.biosimulations.dev/',
    accountApi: 'https://account.biosimulations.dev/',
    dispatchApi: 'https://dispatch.biosimulations.dev/',
    simulatorApi: 'https://api.biosimulations.dev/',
    fetchSimulatorsInfo: fetchSimulatorsURL,
  },
  dev: {
    platformApi: 'https://api.biosimulations.dev/',
    accountApi: 'https://account.biosimulations.dev/',
    dispatchApi: '/api',
    simulatorApi: 'https://api.biosimulations.dev/',
    fetchSimulatorsInfo: fetchSimulatorsURL ,
  },
  stage: {
    platformApi: 'https://api.biosimulations.dev/',
    accountApi: 'https://account.biosimulations.dev/',
    dispatchApi: 'https://dispatch.biosimulations.dev/api',
    simulatorApi: 'https://api.biosimulations.dev/',
    fetchSimulatorsInfo: fetchSimulatorsURL,
  },
  local: {
    platformApi: '/api/', //proxies to localhost:3333 if using nx
    accountApi: '/api/',
    dispatchApi: '/api/',
    simulatorApi: '/api/',
    fetchSimulatorsInfo: fetchSimulatorsURL,
  },
};

export const urls: urlMap = envUrls[environment.env as envs];
