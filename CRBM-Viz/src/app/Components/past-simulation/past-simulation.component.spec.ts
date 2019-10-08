import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PastSimulationComponent } from './past-simulation.component';

describe('PastSimulationComponent', () => {
  let component: PastSimulationComponent;
  let fixture: ComponentFixture<PastSimulationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PastSimulationComponent ]
    })
    .compileComponents();
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
