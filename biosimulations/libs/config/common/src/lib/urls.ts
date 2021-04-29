import { environment } from '@biosimulations/shared/environments';

export type appName =
  | 'platformApi'
  | 'accountApi'
  | 'dispatchApi'
  | 'combineApi'
  | 'simulatorsApi'
  | 'platform'
  | 'account'
  | 'dispatch'
  | 'simulators'
  | 'ontologyApi';

export type envs = 'prod' | 'dev' | 'local' | 'stage';

export type urlMap = { [key in appName]: string };

const envUrls: { [key in envs]: urlMap } = {
  prod: {
    platformApi: 'https://api.biosimulations.org/',
    accountApi: 'https://account.biosimulations.dev/', // NEED TO FIX LOGIN FLOW BEFORE UPDATING
    dispatchApi: 'https://run.api.biosimulations.org/',
    combineApi: 'https://combine.api.biosimulations.org/',
    ontologyApi: 'https://ontology.api.biosimulations.org/',
    simulatorsApi: 'https://api.biosimulators.org/',
    platform: 'https://biosimulations.org',
    account: 'https://login.biosimulations.dev',
    dispatch: 'https://run.biosimulations.org',
    simulators: 'https://biosimulators.org',
  },
  // Technically, this is the "locally run envrionment", which is why its odd. The real dev environment that is deployedd is confusingly called stage.
  // The real "stage" environment is basically just prod, since it should connect to the same resources. The "local" here refers to wanting to connect to a local copy
  // All of this is badly named and organized, and I will try to find a better way.
  //The issue is that this needs to be set at compile time, and cannot use true environment variables like you can for backend apps
  dev: {
    platformApi: 'https://api.biosimulations.dev/',
    accountApi: 'https://account.biosimulations.dev/',
    dispatchApi: '/dispatch-api',
    combineApi: '/combine-api',
    simulatorsApi: '/simulators-api',
    ontologyApi: '/ontology-api',
    platform: 'https://biosimulations.dev',
    account: 'https://login.biosimulations.dev',
    dispatch: 'https://run.biosimulations.dev',
    simulators: 'https://biosimulators.org',
  },
  stage: {
    platformApi: 'https://api.biosimulations.org/',
    accountApi: 'https://account.biosimulations.dev/',
    dispatchApi: 'https://run.api.biosimulations.dev/',
    combineApi: 'https://combine.api.biosimulations.dev/',
    simulatorsApi: 'https://api.biosimulators.dev/',
    ontologyApi: 'https://ontology.api.biosimulations.dev/',
    platform: 'https://biosimulations.dev',
    account: 'https://login.biosimulations.dev',
    dispatch: 'https://run.biosimulations.dev',
    simulators: 'https://biosimulators.org',
  },
  local: {
    platformApi: '/api/', //proxies to localhost:3333 if using nx
    accountApi: '/api/',
    dispatchApi: '/dispatch-api/',
    combineApi: '/combine-api/',
    simulatorsApi: '/simulators-api/',
    ontologyApi: '/ontology-api/',
    platform: 'https://biosimulations.dev',
    account: 'https://login.biosimulations.dev',
    dispatch: 'https://run.biosimulations.dev',
    simulators: 'https://biosimulators.org',
  },
};
export type staticUrlNames =
  | 'platformNewIssue'
  | 'accountNewIssue'
  | 'dispatchNewIssue'
  | 'simulatorsNewIssue'
  | 'platformNewPull'
  | 'accountNewPull'
  | 'dispatchNewPull'
  | 'simulatorsNewPull';
export type staticUrlMap = { [key in staticUrlNames]: string };

export const staticUrls: staticUrlMap = {
  platformNewIssue:
    'https://github.com/biosimulations/Biosimulations/issues/new/choose',
  accountNewIssue:
    'https://github.com/biosimulations/Biosimulations/issues/new/choose',
  dispatchNewIssue:
    'https://github.com/biosimulations/Biosimulations/issues/new/choose',
  simulatorsNewIssue:
    'https://github.com/biosimulators/Biosimulators/issues/new/choose',
  platformNewPull: 'https://github.com/biosimulations/Biosimulations/compare',
  accountNewPull: 'https://github.com/biosimulations/Biosimulations/compare',
  dispatchNewPull: 'https://github.com/biosimulations/Biosimulations/compare',
  simulatorsNewPull: 'https://github.com/biosimulators/Biosimulators/compare',
};
export const urls: urlMap = envUrls[environment.env as envs];