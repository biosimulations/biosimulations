export interface AuthToken {
  'https://biosimulations.org/app_metadata': AppMetadata;
  'https://biosimulations.org/user_metadata': UserMetadata;

  iss: 'https://crbm.auth0.com/';
  sub: string;
  aud: 'api.biosimulations.org' | 'account.biosimulations.org';
  iat: number;
  exp: number;
  azp: string;
  scope: string[];
  permissions?: string[];
}

export interface UserMetadata {
  username: boolean;
}

export interface AppMetadata {
  admin: boolean;
  registered: boolean;
}
