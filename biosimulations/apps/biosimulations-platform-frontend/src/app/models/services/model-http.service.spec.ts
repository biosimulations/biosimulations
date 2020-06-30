import { TestBed } from '@angular/core/testing';

import { ModelHttpService } from './model-http.service';

describe('ModelHttpService', () => {
  let service: ModelHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModelHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
