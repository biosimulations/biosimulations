import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { SharedErrorComponentsModule } from '@biosimulations/shared/error-handler';
import { ProjectSelectVisualizationComponent } from './project-select-visualization.component';

describe('ProjectSelectVisualizationComponent', () => {
  let component: ProjectSelectVisualizationComponent;
  let fixture: ComponentFixture<ProjectSelectVisualizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectSelectVisualizationComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        NoopAnimationsModule,
        BiosimulationsIconsModule,
        SharedUiModule,
        SharedErrorComponentsModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectSelectVisualizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
