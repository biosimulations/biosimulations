import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage-angular';
import { Drivers } from '@ionic/storage';
import { SimulationService } from './simulation.service';
import { ConfigService } from '@biosimulations/shared/angular';

describe('SimulationService', () => {
  let service: SimulationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpClient, HttpHandler, ConfigService],
      imports: [
        IonicStorageModule.forRoot({
          driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage],
        }),
      ],
    });
    service = TestBed.inject(SimulationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
