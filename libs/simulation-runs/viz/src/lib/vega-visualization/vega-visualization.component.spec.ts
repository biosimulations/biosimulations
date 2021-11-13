import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { VegaVisualizationComponent } from './vega-visualization.component';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';

describe('VegaVisualizationComponent', () => {
  let component: VegaVisualizationComponent;
  let fixture: ComponentFixture<VegaVisualizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VegaVisualizationComponent],
      imports: [SharedUiModule, BiosimulationsIconsModule],
    }).compileComponents();
    (async () => {
      if (!('ResizeObserver' in window)) {
        // Loads polyfill asynchronously, only if required.
        const module = await import('@juggle/resize-observer');
        window.ResizeObserver = module.ResizeObserver;
      }
    })();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VegaVisualizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
