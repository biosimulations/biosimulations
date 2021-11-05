import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { VegaVisualizationService } from './vega-visualization.service';

describe('VegaVisualizationService', () => {
  let service: VegaVisualizationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(VegaVisualizationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
