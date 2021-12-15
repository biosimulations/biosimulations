import { TestBed } from '@angular/core/testing';

import { ConsentService } from './consent.service';

describe('ConsentService', () => {
  let service: ConsentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
