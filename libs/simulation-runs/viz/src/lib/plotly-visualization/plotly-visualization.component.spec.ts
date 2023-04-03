import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PlotlyVisualizationComponent } from './plotly-visualization.component';
import { SharedUiModule } from '@biosimulations/shared/ui';

describe('PlotlyVisualizationComponent', () => {
  let component: PlotlyVisualizationComponent;
  let fixture: ComponentFixture<PlotlyVisualizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PlotlyVisualizationComponent],
      imports: [SharedUiModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
    // (async () => {
    //   if (!('ResizeObserver' in window)) {
    //     // Loads polyfill asynchronously, only if required.
    //     const module = await import('@juggle/resize-observer');
    //     window.ResizeObserver = module.ResizeObserver;
    //   }
    // })();
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
