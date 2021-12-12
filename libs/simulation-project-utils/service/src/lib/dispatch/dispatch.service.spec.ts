import { TestBed } from '@angular/core/testing';

import { DispatchService } from './dispatch.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { ConfigService } from '@biosimulations/config/angular';

describe('DispatchService', () => {
  let service: DispatchService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpClient, HttpHandler, ConfigService],
    });
    service = TestBed.inject(DispatchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
