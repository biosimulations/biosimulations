import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { HomeSubsectionComponent } from './home-subsection.component';

describe('HomeSubsectionComponent', () => {
  let component: HomeSubsectionComponent;
  let fixture: ComponentFixture<HomeSubsectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HomeSubsectionComponent],
      imports: [BiosimulationsIconsModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeSubsectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
