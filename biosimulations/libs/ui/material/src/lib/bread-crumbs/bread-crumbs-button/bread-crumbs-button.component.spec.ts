import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BreadCrumbsButtonComponent } from './bread-crumbs-button.component';

describe('BreadCrumbsButtonComponent', () => {
  let component: BreadCrumbsButtonComponent;
  let fixture: ComponentFixture<BreadCrumbsButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BreadCrumbsButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BreadCrumbsButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
