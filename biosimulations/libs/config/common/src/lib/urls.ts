import { environment } from '@biosimulations/shared/environments';

export type appName =
  | 'platformApi'
  | 'accountApi'
  | 'dispatchApi'
  | 'simulatorApi';

export type envs = 'prod' | 'dev' | 'local' | 'stage';

export type urlMap = { [key in appName]: string };

const envUrls: { [key in envs]: urlMap } = {
  prod: {
    platformApi: 'https://api.biosimulations.dev',
    accountApi: 'https://account.biosimulations.dev',
    dispatchApi: 'https://dispatch.biosimulations.dev',
    simulatorApi: 'https://api.biosimulations.dev',
  },
  dev: {
    platformApi: 'https://api.biosimulations.dev',
    accountApi: 'https://account.biosimulations.dev',
    dispatchApi: 'https://dispatch.biosimulations.dev',
    simulatorApi: 'https://api.biosimulations.dev',
  },
  stage: {
    platformApi: 'https://api.biosimulations.dev',
    accountApi: 'https://account.biosimulations.dev',
    dispatchApi: 'https://dispatch.biosimulations.dev',
    simulatorApi: 'https://api.biosimulations.dev',
  },
  local: {
    platformApi: '/api',
    accountApi: '/api',
    dispatchApi: '/api',
    simulatorApi: '/api',
  },
};

export const urls: urlMap = envUrls[environment.env as envs];
