import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatListModule } from '@angular/material/list';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { SharedErrorComponentsModule } from '@biosimulations/shared/error-handler';
import { ProjectSimulationComponent } from './project-simulation.component';

describe('ProjectSimulationComponent', () => {
  let component: ProjectSimulationComponent;
  let fixture: ComponentFixture<ProjectSimulationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectSimulationComponent],
      imports: [
        BiosimulationsIconsModule,
        MatListModule,
        SharedUiModule,
        SharedErrorComponentsModule,
      ],
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
