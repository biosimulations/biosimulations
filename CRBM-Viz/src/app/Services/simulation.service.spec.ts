import { TestBed } from '@angular/core/testing';

import { SimulationService } from './simulation.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MaterialModule } from '../Modules/app-material.module';

describe('SimulationService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MaterialModule],
      providers: [HttpClientTestingModule, MaterialModule],
    })
  );

  it('should be created', () => {
    const service: SimulationService = TestBed.get(SimulationService);
    expect(service).toBeTruthy();
  });
});
