import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { ProjectCardComponent } from '../project-card/project-card.component';
import { ProjectsService } from '../projects.service';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { ProjectsCardsBrowseComponent } from './projects-cards-browse.component';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';

class mockProjectsService {
  getProjects() {
    return of([]);
  }
}

describe('ProjectsCardsBrowseComponent', () => {
  let component: ProjectsCardsBrowseComponent;
  let fixture: ComponentFixture<ProjectsCardsBrowseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectsCardsBrowseComponent, ProjectCardComponent],
      providers: [{ provide: ProjectsService, useClass: mockProjectsService }],
      imports: [RouterTestingModule, MatIconModule, MatCardModule, BiosimulationsIconsModule, LazyLoadImageModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectsCardsBrowseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
