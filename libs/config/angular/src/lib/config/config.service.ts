import { Injectable } from '@angular/core';

/*@Injectable()
export class ConfigService {
  appId!: string;
  appName!: string;
  appNameParts!: string[];
  logo!: string;
  banner!: string;
  appUrl!: string;
  apiUrl!: string;
  email!: string;
  tutorialsUrl!: string | null;
  privacyPolicyVersion = 1;
  newIssueUrl!: string;
  newPullUrl!: string;
  platformAppUrl!: string;
  platformApiUrl!: string;
  platformNewIssueUrl!: string;
  platformNewPullUrl!: string;
  dispatchAppUrl!: string;
  dispatchAppRunsNewUrl!: string;
  utilsConvertFileUrl!: string;
  utilsCreateProjectUrl!: string;
  utilsValidateModelUrl!: string;
  utilsValidateSimulationUrl!: string;
  utilsValidateMetadataUrl!: string;
  utilsValidateProjectUrl!: string;
  utilsSuggestSimulatorUrl!: string;
  dispatchApiUrl!: string;
  dispatchNewIssueUrl!: string;
  dispatchNewPullUrl!: string;
  simulatorsAppUrl!: string;
  simulatorsAppBrowseSimulatorsUrl!: string;
  simulatorsApiUrl!: string;
  simulatorsNewIssueUrl!: string;
  simulatorsNewPullUrl!: string;
  appConfig!: any;
  analyticsId!: string;
}*/

@Injectable()
export class ConfigService {
  appId!: string;
  appName!: string;
  appNameParts!: string[];
  logo!: string;
  banner!: string;
  appUrl!: string;
  apiUrl!: string;
  email!: string;
  docsUrl? = 'https://docs.biosimulations.org/users/';
  tutorialsUrl!: string | null;
  privacyPolicyVersion = 1;
  newIssueUrl!: string;
  newPullUrl!: string;
  platformNewIssueUrl!: string;
  platformNewPullUrl!: string;
  dispatchNewIssueUrl!: string;
  dispatchNewPullUrl!: string;
  simulatorsNewIssueUrl!: string;
  simulatorsNewPullUrl!: string;
  validateSimulatorUrl? =
    'https://github.com/biosimulators/Biosimulators/issues/new?assignees=&labels=Validate%2Fsubmit+simulator&template=ValidateOrSubmitASimulator.yml&title=%5BSimulation+capabilities%5D%3A+';
  appConfig!: any;
  analyticsId!: string;
}
