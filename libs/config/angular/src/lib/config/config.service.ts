import { Injectable } from '@angular/core';

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
  appConfig!: any;
  analyticsId!: string;
}
