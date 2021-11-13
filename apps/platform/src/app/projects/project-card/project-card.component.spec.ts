import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';

import { ProjectCardComponent } from './project-card.component';

describe('ProjectCardComponent', () => {
  let component: ProjectCardComponent;
  let fixture: ComponentFixture<ProjectCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectCardComponent],
      imports: [
        RouterTestingModule,
        MatCardModule,
        MatIconModule,
        LazyLoadImageModule,
        BiosimulationsIconsModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectCardComponent);
    component = fixture.componentInstance;
    component.project = {
      id: '1',
      title: 'title',
      simulationRun: {
        id: '615e7eb6e857da40033c7eb3',
        name: '',
        simulator: 'tellurium',
        simulatorName: 'tellurium',
        simulatorVersion: '2.2.1',
        cpus: 1,
        memory: 8,
        envVars: [],
        runtime: 1,
        projectSize: 1,
        resultsSize: 1,
        submitted: new Date(),
        updated: new Date(),
      },
      metadata: {
        thumbnail: '',
        abstract: undefined,
        keywords: [],
        taxa: [],
        encodes: [],
        identifiers: [],
        citations: [],
        creators: [],
        contributors: [],
        license: undefined,
        funders: [],
        created: new Date(),
        modified: undefined,
      },
      created: new Date(),
      updated: new Date(),
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
