import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametersViewComponent } from './parameters-view.component';

describe('ParametersViewComponent', () => {
  let component: ParametersViewComponent;
  let fixture: ComponentFixture<ParametersViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParametersViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParametersViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
