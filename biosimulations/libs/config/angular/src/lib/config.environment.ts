import { Injectable } from '@angular/core';
import { urls } from '@biosimulations/config/common';
@Injectable()
export class ConfigEnvironment {
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
  platformAppUrl = urls.platform;
  platformApiUrl = urls.platformApi;
  platformNewIssueUrl = urls.platformNewIssue;
  platformNewPullUrl = urls.platformNewPull;
  dispatchAppUrl = urls.dispatch;
  dispatchApiUrl = urls.dispatchApi;
  dispatchNewIssueUrl = urls.dispatchNewIssue;
  dispatchNewPullUrl = urls.dispatchNewPull;
  simulatorsAppUrl = urls.simulators;
  simulatorsApiUrl = urls.simulatorsApi;
  simulatorsNewIssueUrl = urls.simulatorsNewIssue;
  simulatorsNewPullUrl = urls.simulatorsNewPull;
}
