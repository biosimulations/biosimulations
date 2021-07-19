import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SharedUiModule } from '../shared-ui.module';
import { SpinnerComponent } from '../spinner/spinner.component';

import { VegaVisualizationComponent } from './vega-visualization.component';

describe('VegaVisualizationComponent', () => {
  let component: VegaVisualizationComponent;
  let fixture: ComponentFixture<VegaVisualizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VegaVisualizationComponent, SpinnerComponent],
      imports: [MatProgressSpinnerModule],
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
