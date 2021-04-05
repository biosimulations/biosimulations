import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { VisualizationService } from './visualization.service';

describe('VisualizationService', () => {
  let service: VisualizationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpClient, HttpHandler],
    });
    service = TestBed.inject(VisualizationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('test getCombineResultsStructure', () => {
    it('should return an observable containing the result structure', () => {
      const observable = service.getCombineResultsStructure(
        'edb035bc50-sdcj-sdc38ak93n',
      );
      expect(observable).toEqual(observable);
    });
  });

  describe('test getCombineResults', () => {
    it('should return an observable containing the result data', () => {
      const observable = service.getCombineResults(
        'edb035bc50-sdcj-sdc38ak93n',
      );
      expect(observable).toEqual(observable);
    });
  });
});
