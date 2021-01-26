import { TestBed } from '@angular/core/testing';

import { ModelHttpService } from './model-http.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ModelHttpService', () => {
  let service: ModelHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(ModelHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
