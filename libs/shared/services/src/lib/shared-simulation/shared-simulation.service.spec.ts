import { TestBed } from '@angular/core/testing';
import { SharedSimulationService } from '@biosimulations/shared/services';
import { ConfigService } from '@biosimulations/config/angular';
import { Storage } from '@ionic/storage-angular';
import { HttpClient } from '@angular/common/http';
import { SimulationRunService } from '@biosimulations/angular-api-client';

describe('SharedSimulationStatusService', () => {
  let simService: SharedSimulationService;
  let configService: ConfigService;
  let storage: Storage;
  let http: HttpClient;
  let simRunService: SimulationRunService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SharedSimulationService, ConfigService],
    });
    simService = TestBed.inject(SharedSimulationService);
    configService = TestBed.inject(ConfigService);
    storage = TestBed.inject(Storage);
    http = TestBed.inject(HttpClient);
    simRunService = TestBed.inject(SimulationRunService);
  });

  it('should be created', () => {
    expect(simService).toBeTruthy();
    expect(configService).toBeTruthy();
    expect(storage).toBeTruthy();
    expect(http).toBeTruthy();
    expect(simRunService).toBeTruthy();
  });
});
