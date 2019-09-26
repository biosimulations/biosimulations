import { TestBed } from '@angular/core/testing';

import { CrbmAuthService } from './crbm-auth.service';

describe('CrbmAuthService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CrbmAuthService = TestBed.get(CrbmAuthService);
    expect(service).toBeTruthy();
  });
});
