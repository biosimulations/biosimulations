import { TestBed } from '@angular/core/testing';

import { SharedSimulationService } from './shared-simulation.service';

describe('SharedSimulationService', () => {
  let service: SharedSimulationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedSimulationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
