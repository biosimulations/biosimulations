import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { VegaVisualizationComponent } from './vega-visualization.component';
import { SharedUiModule } from '@biosimulations/shared/ui';

describe('VegaVisualizationComponent', () => {
  let component: VegaVisualizationComponent;
  let fixture: ComponentFixture<VegaVisualizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VegaVisualizationComponent],
      imports: [SharedUiModule],
    }).compileComponents();
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
