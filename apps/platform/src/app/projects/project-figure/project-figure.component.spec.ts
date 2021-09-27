import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { of } from 'rxjs';

import { ProjectFigureComponent } from './project-figure.component';

describe('ProjectFiguresComponent', () => {
  let component: ProjectFigureComponent;
  let fixture: ComponentFixture<ProjectFigureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectFigureComponent],
      imports: [SharedUiModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectFigureComponent);
    component = fixture.componentInstance;
    component.figure = { id: '', path: '', spec: of({}) };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
