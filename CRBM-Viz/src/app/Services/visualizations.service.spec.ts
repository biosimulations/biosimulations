import { TestBed } from '@angular/core/testing';

import { VisualizationsService } from './visualizations.service';

describe('VisualizationsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VisualizationsService = TestBed.get(VisualizationsService);
    expect(service).toBeTruthy();
  });
});
