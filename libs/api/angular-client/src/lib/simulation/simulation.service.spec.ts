import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { SimulationService } from './simulation.service';

describe('SimulationService', () => {
  let service: SimulationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SimulationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
