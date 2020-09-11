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
  dispatchAppUrl = urls.dispatch;
  dispatchApiUrl = urls.dispatchApi;
  simulatorsAppUrl = urls.simulators;
  simulatorsApiUrl = urls.simulatorsApi;

  constructor() {}
}
