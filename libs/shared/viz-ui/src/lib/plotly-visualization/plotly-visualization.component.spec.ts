import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PlotlyVisualizationComponent } from './plotly-visualization.component';

describe('PlotlyVisualizationComponent', () => {
  let component: PlotlyVisualizationComponent;
  let fixture: ComponentFixture<PlotlyVisualizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PlotlyVisualizationComponent],
      imports: [],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlotlyVisualizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
