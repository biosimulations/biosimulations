import { TestBed } from '@angular/core/testing';

import { SimulationService } from './simulation.service';

describe('SimulationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SimulationService = TestBed.get(SimulationService);
    expect(service).toBeTruthy();
  });
});
