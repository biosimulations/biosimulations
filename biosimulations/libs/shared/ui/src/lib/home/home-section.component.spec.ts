import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeLogoComponent } from './home-logo.component';

describe('HomeLogoComponent', () => {
  let component: HomeLogoComponent;
  let fixture: ComponentFixture<HomeLogoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HomeLogoComponent],
      imports: [],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
