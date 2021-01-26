import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';
import { SimulationService } from './simulation.service';
import { ConfigService } from '@biosimulations/shared/services';

describe('SimulationService', () => {
  let service: SimulationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpClient, HttpHandler, ConfigService],
      imports: [
        IonicStorageModule.forRoot({
          driverOrder: ['indexeddb', 'websql', 'localstorage'],
        }),
      ],
    });
    service = TestBed.inject(SimulationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
