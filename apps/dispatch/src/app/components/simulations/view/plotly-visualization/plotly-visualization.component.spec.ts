import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlotlyVisualizationComponent } from './plotly-visualization.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('PlotlyVisualizationComponent', () => {
  let component: PlotlyVisualizationComponent;
  let fixture: ComponentFixture<PlotlyVisualizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PlotlyVisualizationComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    //fixture = TestBed.createComponent(PlotlyVisualizationComponent);
    // component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    //expect(component).toBeTruthy();
  });
});
