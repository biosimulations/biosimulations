import { TestBed } from '@angular/core/testing';

import { AuthInterceptorService } from './auth-interceptor.service';

describe('AuthInterceptorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthInterceptorService = TestBed.get(AuthInterceptorService);
    expect(service).toBeTruthy();
  });
});
