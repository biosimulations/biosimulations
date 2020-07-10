import { TestBed } from '@angular/core/testing';

import { DispatchService } from './dispatch.service';

describe('DispatchService', () => {
  let service: DispatchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DispatchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
