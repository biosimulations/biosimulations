import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StepperButtonsComponent } from './next-previous-buttons.component';

describe('StepperButtonsComponent', () => {
  let component: StepperButtonsComponent;
  let fixture: ComponentFixture<StepperButtonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StepperButtonsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StepperButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
