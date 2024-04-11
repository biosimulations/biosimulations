import { TestBed } from '@angular/core/testing';

import { SimulationStatusService } from './shared-simulation-status.service';
import { ConfigService } from '@biosimulations/config/angular';

describe('SharedSimulationStatusService', () => {
  let statusService: SimulationStatusService;
  let configService: ConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SimulationStatusService, ConfigService],
    });
    statusService = TestBed.inject(SimulationStatusService);
    configService = TestBed.inject(ConfigService);
  });

  it('should be created', () => {
    expect(statusService).toBeTruthy();
    expect(configService).toBeTruthy();
  });
});
