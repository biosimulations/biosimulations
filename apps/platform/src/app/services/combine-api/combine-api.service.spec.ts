import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { CombineApiService } from './combine-api.service';

describe('CombineApiService', () => {
  let service: CombineApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpClient, HttpHandler],
    });
    service = TestBed.inject(CombineApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
