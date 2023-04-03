import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { VegaVisualizationComponent } from './vega-visualization.component';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';

describe('VegaVisualizationComponent', () => {
  let component: VegaVisualizationComponent;
  let fixture: ComponentFixture<VegaVisualizationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [VegaVisualizationComponent],
      imports: [SharedUiModule, BiosimulationsIconsModule],
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
