import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { SelectVisualizationComponent } from './select-viz.component';
import { DesignHistogram1DVisualizationComponent } from '../design-histogram-1d-viz/design-histogram-1d-viz.component';
import { DesignHeatmap2DVisualizationComponent } from '../design-heatmap-2d-viz/design-heatmap-2d-viz.component';
import { DesignLine2DVisualizationComponent } from '../design-line-2d-viz/design-line-2d-viz.component';

describe('SelectVisualizationComponent', () => {
  let component: SelectVisualizationComponent;
  let fixture: ComponentFixture<SelectVisualizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        SelectVisualizationComponent,
        DesignHistogram1DVisualizationComponent,
        DesignHeatmap2DVisualizationComponent,
        DesignLine2DVisualizationComponent,
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        NoopAnimationsModule,
        HttpClientTestingModule,
        BiosimulationsIconsModule,
        SharedUiModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectVisualizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
