import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BreadCrumbsPositionComponent } from './bread-crumbs-position.component';

describe('BreadCrumbsPositionComponent', () => {
  let component: BreadCrumbsPositionComponent;
  let fixture: ComponentFixture<BreadCrumbsPositionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BreadCrumbsPositionComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BreadCrumbsPositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
