import { Injectable } from '@angular/core';
import { urls, staticUrls } from '@biosimulations/config/common';
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
  platformNewIssueUrl = staticUrls.platformNewIssue;
  platformNewPullUrl = staticUrls.platformNewPull;
  dispatchAppUrl = urls.dispatch;
  dispatchApiUrl = urls.dispatchApi;
  dispatchNewIssueUrl = staticUrls.dispatchNewIssue;
  dispatchNewPullUrl = staticUrls.dispatchNewPull;
  simulatorsAppUrl = urls.simulators;
  simulatorsApiUrl = urls.simulatorsApi;
  simulatorsNewIssueUrl = staticUrls.simulatorsNewIssue;
  simulatorsNewPullUrl = staticUrls.simulatorsNewPull;
}
