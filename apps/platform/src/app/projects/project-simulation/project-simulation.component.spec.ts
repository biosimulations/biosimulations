import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectSimulationComponent } from './project-simulation.component';

describe('ProjectSimulationComponent', () => {
  let component: ProjectSimulationComponent;
  let fixture: ComponentFixture<ProjectSimulationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectSimulationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectSimulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
