import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectFigureComponent } from './project-figure.component';

describe('ProjectFiguresComponent', () => {
  let component: ProjectFigureComponent;
  let fixture: ComponentFixture<ProjectFigureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectFigureComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectFigureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
