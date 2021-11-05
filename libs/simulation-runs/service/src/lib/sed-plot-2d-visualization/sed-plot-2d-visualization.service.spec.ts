import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { SedPlot2DVisualizationService } from './sed-plot-2d-visualization.service';

describe('SedPlot2DVisualizationService', () => {
  let service: SedPlot2DVisualizationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SedPlot2DVisualizationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
