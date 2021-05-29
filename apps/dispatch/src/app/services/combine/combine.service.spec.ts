import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { CombineService } from './combine.service';

describe('CombineService', () => {
  let service: CombineService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpClient, HttpHandler],
    });
    service = TestBed.inject(CombineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
