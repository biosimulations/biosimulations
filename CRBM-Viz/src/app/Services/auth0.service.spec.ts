import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth0.service';

describe('Auth0Service', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthService = TestBed.get(AuthService);
    expect(service).toBeTruthy();
  });
});
