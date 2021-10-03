import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { SharedUiModule } from '@biosimulations/shared/ui';

import { ProjectMetadataComponent } from './project-metadata.component';

describe('ProjectMetadataComponent', () => {
  let component: ProjectMetadataComponent;
  let fixture: ComponentFixture<ProjectMetadataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectMetadataComponent],
      imports: [
        BiosimulationsIconsModule,
        SharedUiModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectMetadataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
