import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatListModule } from '@angular/material/list';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { SharedErrorComponentsModule } from '@biosimulations/shared/error-handler';
import { ProjectFilesComponent } from './project-files.component';

describe('ProjectFilesComponent', () => {
  let component: ProjectFilesComponent;
  let fixture: ComponentFixture<ProjectFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectFilesComponent],
      imports: [
        BiosimulationsIconsModule,
        MatListModule,
        SharedUiModule,
        SharedErrorComponentsModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
