import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { ProjectCardComponent } from '../project-card/project-card.component';
import { BrowseService } from './browse.service';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { BrowseComponent } from './browse.component';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';

class mockBrowseService {
  getProjects() {
    return of([]);
  }
}

describe('BrowseComponent', () => {
  let component: BrowseComponent;
  let fixture: ComponentFixture<BrowseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BrowseComponent, ProjectCardComponent],
      providers: [{ provide: BrowseService, useClass: mockBrowseService }],
      imports: [
        RouterTestingModule,
        MatIconModule,
        MatCardModule,
        BiosimulationsIconsModule,
        LazyLoadImageModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
