import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MaterialFileInputModule } from '@biosimulations/material-file-input';
import { ValidateSimulationComponent } from './validate-simulation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { IonicStorageModule } from '@ionic/storage-angular';
import { Drivers } from '@ionic/storage';
import { Storage } from '@ionic/storage-angular';
import { ConfigService } from '@biosimulations/config/angular';

describe('ValidateSimulationComponent', () => {
  let component: ValidateSimulationComponent;
  let fixture: ComponentFixture<ValidateSimulationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
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
      declarations: [ValidateSimulationComponent],
      providers: [
        HttpClient,
        HttpHandler,
        {
          provide: ConfigService,
          useValue: {
            appConfig: {
              exampleCombineArchives: {
                repoOwnerName: '',
                repoRef: '',
                repoPath: '',
                exampleSimulationPath: '',
              },
              maxUploadFileSize: 64000000,
            },
          },
        },
        Storage,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateSimulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
