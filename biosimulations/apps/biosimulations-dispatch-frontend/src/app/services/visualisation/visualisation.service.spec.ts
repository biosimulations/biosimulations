import { TestBed } from '@angular/core/testing';

import { VisualisationService } from './visualisation.service';

describe('VisualisationService', () => {
  let service: VisualisationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VisualisationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
