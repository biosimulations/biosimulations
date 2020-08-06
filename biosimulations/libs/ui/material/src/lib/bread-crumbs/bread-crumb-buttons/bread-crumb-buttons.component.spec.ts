import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BreadCrumbButtonsComponent } from './bread-crumb-buttons.component';

describe('BreadCrumbButtonsComponent', () => {
  let component: BreadCrumbButtonsComponent;
  let fixture: ComponentFixture<BreadCrumbButtonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BreadCrumbButtonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BreadCrumbButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
