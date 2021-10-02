import { ComponentFixture, TestBed } from '@angular/core/testing';
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
