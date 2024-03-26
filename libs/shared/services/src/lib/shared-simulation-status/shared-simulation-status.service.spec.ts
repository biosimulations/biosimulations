import { TestBed } from '@angular/core/testing';

import { SharedSimulationStatusService } from './shared-simulation-status.service';

describe('SharedSimulationStatusService', () => {
  let service: SharedSimulationStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedSimulationStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
