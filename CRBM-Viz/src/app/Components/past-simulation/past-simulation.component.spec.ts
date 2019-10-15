import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PastSimulationComponent } from './past-simulation.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('PastSimulationComponent', () => {
  let component: PastSimulationComponent;
  let fixture: ComponentFixture<PastSimulationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PastSimulationComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PastSimulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
