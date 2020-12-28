import { Injectable } from '@angular/core';

// TODO this is not really a service, just use the config map and remove this, or add some dynamic methods if needed 
@Injectable()
export class ConfigService {
  appName!: string;
  appNameParts!: string[];
  logo!: string;
  banner!: string;
  appUrl!: string;
  apiUrl!: string;
  email!: string;
  privacyPolicyVersion = 1;
  newIssueUrl!: string;
  newPullUrl!: string;
  platformAppUrl!: string;
  platformApiUrl!: string;
  platformNewIssueUrl!: string;
  platformNewPullUrl!: string;
  dispatchAppUrl!: string;
  dispatchApiUrl!: string;
  dispatchNewIssueUrl!: string;
  dispatchNewPullUrl!: string;
  simulatorsAppUrl!: string;
  simulatorsApiUrl!: string;
  simulatorsNewIssueUrl!: string;
  simulatorsNewPullUrl!: string;
}
