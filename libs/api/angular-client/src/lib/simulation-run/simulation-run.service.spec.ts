import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { SimulationRunService } from './simulation-run.service';

describe('SimulationRunService', () => {
  let service: SimulationRunService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SimulationRunService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
