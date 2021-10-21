import { Injectable } from '@angular/core';

@Injectable()
export class ConfigService {
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
  dispatchApiUrl!: string;
  dispatchNewIssueUrl!: string;
  dispatchNewPullUrl!: string;
  simulatorsAppUrl!: string;
  simulatorsApiUrl!: string;
  simulatorsNewIssueUrl!: string;
  simulatorsNewPullUrl!: string;
  appConfig!: any;
}
