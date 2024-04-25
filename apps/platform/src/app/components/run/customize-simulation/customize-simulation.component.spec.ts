import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomizeSimulationComponent } from './customize-simulation.component';
import { ConfigService } from '@biosimulations/config/angular';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Drivers } from '@ionic/storage';
import { IonicStorageModule, Storage } from '@ionic/storage-angular';

describe('CustomizeSimulationComponent', () => {
  let component: CustomizeSimulationComponent;
  let fixture: ComponentFixture<CustomizeSimulationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomizeSimulationComponent],
      providers: [ConfigService, Storage],
      imports: [
        HttpClientTestingModule,
        IonicStorageModule.forRoot({
          driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomizeSimulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
