import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { DesignHistogram1DVisualizationComponent } from './design-histogram-1d-viz.component';
import { FormBuilder } from '@angular/forms';

describe('DesignHistogram1DVisualizationComponent', () => {
  let component: DesignHistogram1DVisualizationComponent;
  let fixture: ComponentFixture<DesignHistogram1DVisualizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DesignHistogram1DVisualizationComponent],
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
    fixture = TestBed.createComponent(DesignHistogram1DVisualizationComponent);
    component = fixture.componentInstance;
    component.formGroup = new FormBuilder().group({});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
