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
      imports: [RouterTestingModule, MatCardModule, MatIconModule, LazyLoadImageModule, BiosimulationsIconsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectCardComponent);
    component = fixture.componentInstance;
    component.project = { 
      id: '1',       
      metadata: {
        title: 'example title' ,
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
        created: {
          value: new Date(),
          formattedValue: 'date',
        },
        modified: [],
      },
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
