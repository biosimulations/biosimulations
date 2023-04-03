import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { ProjectCardComponent } from '../project-card/project-card.component';
import { BrowseService } from './browse.service';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { BrowseComponent } from './browse.component';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ScrollService } from '@biosimulations/shared/angular';
import { ProjectsModule } from '../projects.module';

class mockBrowseService {
  getProjects() {
    return of([]);
  }
}

describe('BrowseComponent', () => {
  let component: BrowseComponent;
  let fixture: ComponentFixture<BrowseComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BrowseComponent, ProjectCardComponent],
      providers: [{ provide: BrowseService, useClass: mockBrowseService }, ScrollService],
      imports: [
        RouterTestingModule,
        MatIconModule,
        MatCardModule,
        BiosimulationsIconsModule,
        LazyLoadImageModule,
        SharedUiModule,
        NoopAnimationsModule,
        ProjectsModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
