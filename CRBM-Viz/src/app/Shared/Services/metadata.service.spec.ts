import { TestBed, getTestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { MetadataService } from './metadata.service';

describe('MetadataService', () => {
  let injector: TestBed;
  let httpMock: HttpTestingController;
  let service: MetadataService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MetadataService],
      imports: [HttpClientTestingModule],
    });
    injector = getTestBed();
    service = injector.get(MetadataService);
    httpMock = injector.get(HttpTestingController);
  });
  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    const service: MetadataService = TestBed.get(MetadataService);
    expect(service).toBeTruthy();
  });
});
