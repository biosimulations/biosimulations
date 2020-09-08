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
  privacyPolicyVersion = 1;
  newIssueUrl!: string;
  newPullUrl!: string;
  platformAppUrl!: string;
  platformApiUrl!: string;
  dispatchAppUrl!: string;
  dispatchApiUrl!: string;
  simulatorsAppUrl!: string;
  simulatorsApiUrl!: string;

  constructor() {}
}
