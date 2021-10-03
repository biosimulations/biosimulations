import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { SharedVizUiModule } from '@biosimulations/shared/viz-ui';
import { SharedErrorComponentsModule } from '@biosimulations/shared/error-handler';
import { ProjectVisualizationComponent } from './project-visualization.component';

describe('ProjectVisualizationComponent', () => {
  let component: ProjectVisualizationComponent;
  let fixture: ComponentFixture<ProjectVisualizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectVisualizationComponent],
      imports: [
        BiosimulationsIconsModule,
        SharedUiModule,
        SharedVizUiModule,
        SharedErrorComponentsModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectVisualizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
