import { TestBed } from '@angular/core/testing';

import { ModelDataService } from './model-data.service';

describe('ModelDataService', () => {
  let service: ModelDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModelDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
