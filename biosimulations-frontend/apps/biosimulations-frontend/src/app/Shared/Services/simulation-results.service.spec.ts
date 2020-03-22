import { TestBed } from '@angular/core/testing';

import { SimulationResultsService } from './simulation-results.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SimulationResultsService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HttpClientTestingModule],
    })
  );

  it('should be created', () => {
    const service: SimulationResultsService = TestBed.get(SimulationResultsService);
    expect(service).toBeTruthy();
  });
});
