import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { VegaViewerComponent } from './vega-viewer.component';

describe('VegaViewerComponent', () => {
  let component: VegaViewerComponent;
  let fixture: ComponentFixture<VegaViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VegaViewerComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VegaViewerComponent);
    component = fixture.componentInstance;
    component.spec = {
      $schema: 'https://vega.github.io/schema/vega/v5.json',
      width: 400,
      height: 200,
      padding: 5,

      data: [
        {
          name: 'table',
          values: [
            {category: 'A', amount: 28},
            {category: 'B', amount: 55},
            {category: 'C', amount: 43}
          ]
        }
      ],

      scales: [
        {
          name: 'xscale',
          type: 'band',
          domain: {data: 'table', field: 'category'},
          range: 'width',
          padding: 0.05,
          round: true
        },
        {
          name: 'yscale',
          domain: {data: 'table', field: 'amount'},
          nice: true,
          range: 'height'
        }
      ],

      axes: [
        { orient: 'bottom', scale: 'xscale' },
        { orient: 'left', scale: 'yscale' }
      ],

      marks: [
        {
          type: 'rect',
          from: {data:'table'},
          encode: {
            enter: {
              x: {scale: 'xscale', field: 'category'},
              width: {scale: 'xscale', band: 1},
              y: {scale: 'yscale', field: 'amount'},
              y2: {scale: 'yscale', value: 0}
            },
            update: {
              fill: {value: 'steelblue'}
            },
            hover: {
              fill: {value: 'red'}
            }
          }
        },
      ]
    }
    fixture.detectChanges();
  });

  it('should create', async(() => {
    expect(component).toBeTruthy();
  }));
});
