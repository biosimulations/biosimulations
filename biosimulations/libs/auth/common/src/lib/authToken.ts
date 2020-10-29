export interface AuthToken {
  'https://biosimulations.org/app_metadata': AppMetadata;
  'https://biosimulations.org/user_metadata': UserMetadata;
  iss: 'https://auth.biosimulations.org';
  sub: string;
  aud: 'api.biosimulations.org' | 'account.biosimulations.org';
  iat: number;
  exp: number;
  azp: string;
  scope: string[];
  permissions?: string[];
  gty?: string;
}
export interface IdToken {
  'https://biosimulations.org/app_metadata': AppMetadata;
  'https://biosimulations.org/user_metadata': UserMetadata;
}
export interface UserMetadata {
  username: string;
}

export interface AppMetadata {
  admin: boolean;
  registered: boolean;
  termsAcceptedOn: number | null;
}
