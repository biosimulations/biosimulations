import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RunCustomSimulationComponent } from './run-custom-simulation.component';

describe('RunCustomSimulationComponent', () => {
  let component: RunCustomSimulationComponent;
  let fixture: ComponentFixture<RunCustomSimulationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RunCustomSimulationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RunCustomSimulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
