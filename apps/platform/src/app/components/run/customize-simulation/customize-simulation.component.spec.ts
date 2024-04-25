import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomizeSimulationComponent } from './customize-simulation.component';
import { ConfigService } from '@biosimulations/config/angular';
import { Drivers } from '@ionic/storage';
import { IonicStorageModule, Storage } from '@ionic/storage-angular';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MaterialFileInputModule } from '@biosimulations/material-file-input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('CustomizeSimulationComponent', () => {
  let component: CustomizeSimulationComponent;
  let fixture: ComponentFixture<CustomizeSimulationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomizeSimulationComponent],
      providers: [ConfigService, Storage, HttpClient, HttpHandler],
      imports: [
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        SharedUiModule,
        BiosimulationsIconsModule,
        MatFormFieldModule,
        MatSelectModule,
        MaterialFileInputModule,
        NoopAnimationsModule,
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
