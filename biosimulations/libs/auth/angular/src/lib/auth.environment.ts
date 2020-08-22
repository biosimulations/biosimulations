import { Injectable } from '@angular/core';
@Injectable()
export class AuthEnvironment {
  authDomain = 'auth.biosimulations.org';
  apiDomain = 'api.biosimulations.org';
  redirectUri = `${window.location.origin}`;
  logoutUri = `${window.location.origin}`;
  scope = '';
  clientId!: string;
  audience!: string;
}
