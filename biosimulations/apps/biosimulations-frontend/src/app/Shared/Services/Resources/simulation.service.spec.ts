import { TestBed } from '@angular/core/testing';

import { SimulationService } from './simulation.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule } from '@angular/material/dialog';

describe('SimulationService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, MatDialogModule],
      providers: [
        HttpClientTestingModule,
        RouterTestingModule,
        MatDialogModule,
      ],
    }),
  );

  it('should be created', () => {
    const service: SimulationService = TestBed.inject(SimulationService);
    expect(service).toBeTruthy();
  });
});
