import { environment } from '@biosimulations/shared/environments';

const fetchSimulatorsURL =
  'https://hub.docker.com/v2/repositories/biosimulators/?page_size=25&page=1&ordering=last_updated';

export type appName =
  | 'platformApi'
  | 'accountApi'
  | 'dispatchApi'
  | 'simulatorsApi'
  | 'platformNewIssue'
  | 'accountNewIssue'
  | 'dispatchNewIssue'
  | 'simulatorsNewIssue'
  | 'platformNewPull'
  | 'accountNewPull'
  | 'dispatchNewPull'
  | 'simulatorsNewPull'
  | 'platform'
  | 'account'
  | 'dispatch'
  | 'simulators'
  | 'ontologyApi'
  | 'fetchSimulatorsInfo';

export type envs = 'prod' | 'dev' | 'local' | 'stage';

export type urlMap = { [key in appName]: string };

const envUrls: { [key in envs]: urlMap } = {
  prod: {
    platformApi: 'https://api.biosimulations.dev/',
    accountApi: 'https://account.biosimulations.dev/',
    dispatchApi: 'https://dispatch.biosimulations.dev',
    simulatorsApi: 'https://api.biosimulators.org/',
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
    platform: 'https://biosimulations.dev',
    account: 'https://login.biosimulations.dev',
    dispatch: 'https://run.biosimulations.dev',
    simulators: 'https://biosimulators.org',
    ontologyApi: 'https://ontology.biosimulations.dev',
    fetchSimulatorsInfo: fetchSimulatorsURL,
  },
  dev: {
    platformApi: 'https://api.biosimulations.dev/',
    accountApi: 'https://account.biosimulations.dev/',
    dispatchApi: 'https://run.biosimulations.dev/',
    simulatorsApi: '/simulators-api',
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
    platform: 'https://biosimulations.dev',
    account: 'https://login.biosimulations.dev',
    dispatch: 'https://run.biosimulations.dev',
    simulators: 'https://biosimulators.org',
    ontologyApi: '/ontology-api',
    fetchSimulatorsInfo: fetchSimulatorsURL,
  },
  stage: {
    platformApi: 'https://api.biosimulations.dev/',
    accountApi: 'https://account.biosimulations.dev/',
    dispatchApi: 'https://dispatch.biosimulations.dev',
    simulatorsApi: 'https://api.biosimulators.org/',
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
    platform: 'https://biosimulations.dev',
    account: 'https://login.biosimulations.dev',
    dispatch: 'https://run.biosimulations.dev',
    simulators: 'https://biosimulators.org',
    ontologyApi: 'https://ontology.biosimulations.dev',
    fetchSimulatorsInfo: fetchSimulatorsURL,
  },
  local: {
    platformApi: '/api/', //proxies to localhost:3333 if using nx
    accountApi: '/api/',
    dispatchApi: '/api/',
    simulatorsApi: '/simulators-api/',
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
    platform: 'https://biosimulations.dev',
    account: 'https://login.biosimulations.dev',
    dispatch: 'https://run.biosimulations.dev',
    simulators: 'https://biosimulators.org',
    ontologyApi: '/ontology-api',
    fetchSimulatorsInfo: fetchSimulatorsURL,
  },
};

export const urls: urlMap = envUrls[environment.env as envs];
