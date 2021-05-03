import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { SuggestSimulatorComponent } from './suggest-simulator.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { IonicStorageModule } from '@ionic/storage';
import { ConfigService } from '@biosimulations/shared/services';
import config from '../../../../assets/config.json';

describe('SuggestSimulatorComponent', () => {
  let component: SuggestSimulatorComponent;
  let fixture: ComponentFixture<SuggestSimulatorComponent>;

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
        NoopAnimationsModule,
        IonicStorageModule.forRoot({
          driverOrder: ['indexeddb', 'websql', 'localstorage'],
        }),
      ],
      declarations: [SuggestSimulatorComponent],
      providers: [
        HttpClient,
        HttpHandler,
        { provide: ConfigService, useValue: config },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestSimulatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
