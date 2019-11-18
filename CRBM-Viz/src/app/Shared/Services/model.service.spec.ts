import { TestBed } from '@angular/core/testing';

import { ModelService } from './simulation.service';

describe('ModelService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({})
  );

  it('should be created', () => {
    const service: ModelService = TestBed.get(ModelService);
    expect(service).toBeTruthy();
  });
});
