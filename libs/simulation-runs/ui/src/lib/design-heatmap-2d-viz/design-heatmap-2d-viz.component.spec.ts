import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { DesignHeatmap2DVisualizationComponent } from './design-heatmap-2d-viz.component';
import { FormBuilder } from '@angular/forms';

describe('DesignHeatmap2DVisualizationComponent', () => {
  let component: DesignHeatmap2DVisualizationComponent;
  let fixture: ComponentFixture<DesignHeatmap2DVisualizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DesignHeatmap2DVisualizationComponent],
      imports: [
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        NoopAnimationsModule,
        BiosimulationsIconsModule,
        SharedUiModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignHeatmap2DVisualizationComponent);
    component = fixture.componentInstance;
    component.formGroup = new FormBuilder().group({});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
