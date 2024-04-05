import { TestBed } from '@angular/core/testing';
import { SharedSimulationService } from '@biosimulations/shared/services';
import { ConfigService } from '@biosimulations/config/angular';

describe('SharedSimulationStatusService', () => {
  let simService: SharedSimulationService;
  let configService: ConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SharedSimulationService, ConfigService],
    });
    simService = TestBed.inject(SharedSimulationService);
    configService = TestBed.inject(ConfigService);
  });

  it('should be created', () => {
    expect(simService).toBeTruthy();
    expect(configService).toBeTruthy();
  });
});
