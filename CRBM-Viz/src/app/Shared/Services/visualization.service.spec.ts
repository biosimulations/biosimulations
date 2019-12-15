import { TestBed, getTestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { VisualizationService } from './visualization.service';

describe('VisualizationService', () => {
  let injector: TestBed;
  let httpMock: HttpTestingController;
  let service: VisualizationService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [HttpClientTestingModule, RouterTestingModule, VisualizationService],
    });
    injector = getTestBed();
    service = injector.get(VisualizationService);
    httpMock = injector.get(HttpTestingController);
  });
  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    const visservice: VisualizationService = TestBed.get(
      VisualizationService
    );
    expect(visservice).toBeTruthy();
  });
});
