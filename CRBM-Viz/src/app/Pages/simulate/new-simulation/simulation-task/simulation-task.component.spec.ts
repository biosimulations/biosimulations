import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulationTaskComponent } from './simulation-task.component';

describe('SimulationTaskComponent', () => {
  let component: SimulationTaskComponent;
  let fixture: ComponentFixture<SimulationTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimulationTaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulationTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
