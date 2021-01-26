import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { VisualizationService } from './visualization.service';
import { Observable } from 'rxjs';

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

  describe('test getReport', () => {
    it('should return an observable containing the visualization data', () => {
      const observable = service.getReport(
        'edb035bc50-sdcj-sdc38ak93n',
        'VilarBMDB',
        'task1',
      );
      expect(observable).toEqual(observable);
    });
  });

  describe('test getResultStructure', () => {
    it('should return an observable containing the result structure', () => {
      const observable = service.getResultStructure(
        'edb035bc50-sdcj-sdc38ak93n',
      );
      expect(observable).toEqual(observable);
    });
  });
});
