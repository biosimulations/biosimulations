import { TestBed } from '@angular/core/testing';
import { SharedSimulationService } from '@biosimulations/shared/services';

describe('SharedSimulationStatusService', () => {
  let service: SharedSimulationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedSimulationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
