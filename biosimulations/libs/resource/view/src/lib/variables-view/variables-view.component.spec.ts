import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VariablesViewComponent } from './variables-view.component';

describe('VariablesViewComponent', () => {
  let component: VariablesViewComponent;
  let fixture: ComponentFixture<VariablesViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VariablesViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VariablesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
