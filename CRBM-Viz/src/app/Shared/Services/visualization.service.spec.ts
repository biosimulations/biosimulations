import { TestBed, getTestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { VisualizationService } from './visualization.service';
import { Visualization } from 'src/app/Shared/Models/visualization';
import { VisualizationSchema } from 'src/app/Shared/Models/visualization-schema';

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

  it('should return an Observable<any[]>', () => {
    const schema = new VisualizationSchema();
    schema.spec = {
      $schema: 'https://vega.github.io/schema/vega-lite/v3.json',
      description: 'A simple bar chart with embedded data.',
      width: 360,
      data: {
        values: [
          {
            a: 'A',
            b: 28,
          },
          {
            a: 'B',
            b: 55,
          },
          {
            a: 'C',
            b: 43,
          },
          {
            a: 'D',
            b: 91,
          },
          {
            a: 'E',
            b: 81,
          },
          {
            a: 'F',
            b: 53,
          },
          {
            a: 'G',
            b: 19,
          },
          {
            a: 'H',
            b: 87,
          },
          {
            a: 'I',
            b: 52,
          },
        ],
      },
      mark: 'bar',
      encoding: {
        x: {
          field: 'a',
          type: 'ordinal',
        },
        y: {
          field: 'b',
          type: 'quantitative',
        },
        tooltip: {
          field: 'b',
          type: 'quantitative',
        },
      },
    };

    const dummyVizs: Visualization[] = [{
      id: 1,
      name: 'test',
      description: null,
      tags: [],
      schema,        
      getIcon: null,
      getRoute: null,
      getAuthors: null,
    }];

    service.getVisualization(1).subscribe(vizs => {
      expect(vizs.length).toEqual(1);
      expect(vizs[0].id).toEqual(dummyVizs[0].id);
      expect(vizs[0].name).toEqual(dummyVizs[0].name);
      // expect(vizs[0].spec).toEqual(dummyVizs[0].schema.spec);
    });

    const req = httpMock.expectOne('https://crbm-test-api.herokuapp.com/vis/001');
    expect(req.request.method).toBe('GET');
      req.flush(dummyVizs);
  });
});
