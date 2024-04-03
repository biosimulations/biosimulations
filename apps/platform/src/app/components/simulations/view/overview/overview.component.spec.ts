import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OverviewComponent } from './overview.component';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { ConfigService } from '@biosimulations/config/angular';
import { SimulationService } from '../../../../services/simulation/simulation.service';
import { Storage } from '@ionic/storage-angular';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormattedSimulation } from '../view.model';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Purpose, SimulationRunStatus } from '@biosimulations/datamodel/common';

describe('OverviewComponent', () => {
  let component: OverviewComponent;
  let fixture: ComponentFixture<OverviewComponent>;
  const mockSimulation: FormattedSimulation = {
    id: 'sim1',
    name: 'Example Simulation',
    simulator: 'Some Simulator',
    simulatorVersion: '1.0',
    simulatorDigest: 'digest',
    simulatorUrl: 'http://example.com',
    cpus: 1,
    memory: '512MB',
    maxTime: '1h',
    envVars: [], // Assuming your component doesn't use this deeply
    purpose: Purpose.academic, // Use an actual value from the Purpose enum
    status: SimulationRunStatus.SUCCEEDED, // Use an actual value from the SimulationRunStatus enum
    statusRunning: false,
    statusSucceeded: true,
    statusFailed: false,
    statusLabel: 'Success',
    submitted: new Date().toISOString(),
    updated: new Date().toISOString(),
    // runtime: '10m', // Uncomment and set if used
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OverviewComponent],
      imports: [
        BiosimulationsIconsModule,
        HttpClientTestingModule,
        // Add the Angular Material modules here
        MatCardModule,
        MatSnackBarModule,
      ],
      providers: [
        ConfigService,
        SimulationService,
        Storage,
        // If you have any service that needs to be mocked, add it here
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverviewComponent);
    component = fixture.componentInstance;
    component.simulation = mockSimulation;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
