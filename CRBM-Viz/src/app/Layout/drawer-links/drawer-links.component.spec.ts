import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawerLinksComponent } from './drawer-links.component';

describe('DrawerLinksComponent', () => {
  let component: DrawerLinksComponent;
  let fixture: ComponentFixture<DrawerLinksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrawerLinksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawerLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
