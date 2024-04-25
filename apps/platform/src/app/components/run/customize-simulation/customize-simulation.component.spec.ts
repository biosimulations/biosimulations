import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomizeSimulationComponent } from './customize-simulation.component';
import { ConfigService } from '@biosimulations/config/angular';

describe('CustomizeSimulationComponent', () => {
  let component: CustomizeSimulationComponent;
  let fixture: ComponentFixture<CustomizeSimulationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomizeSimulationComponent],
      providers: [ConfigService],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomizeSimulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
