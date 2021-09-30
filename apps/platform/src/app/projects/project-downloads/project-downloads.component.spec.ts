import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatListModule } from '@angular/material/list';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { SharedErrorComponentsModule } from '@biosimulations/shared/error-handler';
import { ProjectDownloadsComponent } from './project-downloads.component';

describe('ProjectDownloadsComponent', () => {
  let component: ProjectDownloadsComponent;
  let fixture: ComponentFixture<ProjectDownloadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectDownloadsComponent],
      imports: [
        BiosimulationsIconsModule,
        MatListModule,
        SharedUiModule,
        SharedErrorComponentsModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectDownloadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
