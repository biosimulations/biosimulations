import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectsChipsComponent } from './projects-chips.component';

describe('ProjectsChipsComponent', () => {
  let component: ProjectsChipsComponent;
  let fixture: ComponentFixture<ProjectsChipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectsChipsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectsChipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
