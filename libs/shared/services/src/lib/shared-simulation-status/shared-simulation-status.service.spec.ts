import { TestBed } from '@angular/core/testing';

import { SimulationStatusService } from '@biosimulations/shared/services';

describe('SharedSimulationStatusService', () => {
  let service: SimulationStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SimulationStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
