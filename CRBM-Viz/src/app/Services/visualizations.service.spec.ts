import { TestBed, getTestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { VisualizationsService } from './visualizations.service';
import { Visualization } from 'src/app/Models/visualization';

describe('VisualizationsService', () => {
  let injector: TestBed;
  let httpMock: HttpTestingController;
  let service: VisualizationsService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VisualizationsService],
      imports: [HttpClientTestingModule],
    });
    injector = getTestBed();
    service = injector.get(VisualizationsService);
    httpMock = injector.get(HttpTestingController);
  });
  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    const service: VisualizationsService = TestBed.get(VisualizationsService);
    expect(service).toBeTruthy();
  });

  it('should return an Observable<Visualization[]>', () => {
    const dummyViz: Visualization[] = [
      {
        name: 'test',
        id: 1,
        spec: {
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
        },
      },
    ];
    service.getVisualizations('1').subscribe(viz => {
      expect(viz.length).toBe(1);
      expect(viz).toEqual(dummyViz);
    });

    const req = httpMock.expectOne('https://crbm-test-api.herokuapp.com/vis/1');
    expect(req.request.method).toBe('GET');
    req.flush(dummyViz);
  });
});
