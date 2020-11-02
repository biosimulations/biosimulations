export interface AuthToken {
  iss: 'https://auth.biosimulations.org';
  sub: string;
  aud: 'api.biosimulations.org' | 'account.biosimulations.org';
  iat: number;
  exp: number;
  azp: string;
  scope?: string[];
  permissions?: string[];
  'https://biosimulations.org/permissions': string[];
  'https://biosimulations.org/roles': string[];
  'https://biosimulations.org/app_metadata': AppMetadata;
  'https://biosimulations.org/user_metadata': UserMetadata;
  gty?: string;
}
export interface IdToken {
  'https://biosimulations.org/app_metadata': AppMetadata;
  'https://biosimulations.org/user_metadata': UserMetadata;
  'https://biosimulations.org/permissions': string[];
  'https://biosimulations.org/roles': string[];
}
export interface UserMetadata {
  username: string;
}

export interface AppMetadata {
  roles: string[];
  permissions: string[];
  registered: boolean;
  termsAcceptedOn: number | null;
}
