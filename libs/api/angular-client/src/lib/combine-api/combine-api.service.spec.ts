import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { CombineApiService } from './combine-api.service';

describe('CombineApiService', () => {
  let service: CombineApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(CombineApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
