import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage-angular';
import { Drivers } from '@ionic/storage';
import { Storage } from '@ionic/storage-angular';
import { SharedSimulationService } from '@biosimulations/shared/services';
import { ConfigService } from '@biosimulations/config/angular';

describe('SimulationService', () => {
  let service: SharedSimulationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpClient, HttpHandler, ConfigService, Storage],
      imports: [
        IonicStorageModule.forRoot({
          driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage],
        }),
      ],
    });
    service = TestBed.inject(SharedSimulationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
