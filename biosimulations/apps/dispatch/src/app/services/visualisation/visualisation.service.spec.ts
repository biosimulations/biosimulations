import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { VisualisationService } from './visualisation.service';
import { Observable } from 'rxjs';

describe('VisualisationService', () => {
  let service: VisualisationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpClient, HttpHandler],
    });
    service = TestBed.inject(VisualisationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('test getVisualization', () => {
    it('should return an observable containing the visualization data', () => {
      const observable = service.getVisualisation('edb035bc50-sdcj-sdc38ak93n', 'VilarBMDB', 'task1');
      expect(observable)
      .toEqual(observable);
    })
  })

  describe('test getResultStructure', () => {
    it('should return an observable containing the result structure', () => {
      const observable = service.getResultStructure('edb035bc50-sdcj-sdc38ak93n')
      expect(observable)
      .toEqual(observable);
    })
  })
});
