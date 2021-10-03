import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { SharedVizUiModule } from '@biosimulations/shared/viz-ui';
import { of } from 'rxjs';

import { ProjectVegaVisualizationComponent } from './project-vega-visualization.component';

describe('ProjectVegaVisualizationComponent', () => {
  let component: ProjectVegaVisualizationComponent;
  let fixture: ComponentFixture<ProjectVegaVisualizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectVegaVisualizationComponent],
      imports: [SharedUiModule, SharedVizUiModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectVegaVisualizationComponent);
    component = fixture.componentInstance;
    component.simulationId = '';
    component.vegaSpec = of({});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
