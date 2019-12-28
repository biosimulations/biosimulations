import { TestBed } from '@angular/core/testing';

import { BioModelService } from './bio-model.service';

describe('BioModelService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BioModelService = TestBed.get(BioModelService);
    expect(service).toBeTruthy();
  });
});
