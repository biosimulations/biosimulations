import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavIconsComponent } from './nav-icons.component';

describe('NavIconsComponent', () => {
  let component: NavIconsComponent;
  let fixture: ComponentFixture<NavIconsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavIconsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavIconsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
