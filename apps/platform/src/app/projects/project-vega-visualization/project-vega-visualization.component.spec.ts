import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { of } from 'rxjs';

import { ProjectVegaVisualizationComponent } from './project-figure.component';

describe('ProjectVegaVisualizationComponent', () => {
  let component: ProjectVegaVisualizationComponent;
  let fixture: ComponentFixture<ProjectVegaVisualizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectVegaVisualizationComponent],
      imports: [SharedUiModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectVegaVisualizationComponent);
    component = fixture.componentInstance;
    component.figure = { id: '', path: '', spec: of({}) };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
