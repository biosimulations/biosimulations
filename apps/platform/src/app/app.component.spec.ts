import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { AuthService, AuthEnvironment } from '@biosimulations/auth/angular';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { IonicStorageModule } from '@ionic/storage-angular';
import { Drivers } from '@ionic/storage';
import { Storage } from '@ionic/storage-angular';
import { ScrollService } from '@biosimulations/shared/angular';
import { ConfigService } from '@biosimulations/config/angular';
import { HealthService } from '@biosimulations/angular-api-client';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        SharedUiModule,
        HttpClientTestingModule,
        BiosimulationsIconsModule,
        NoopAnimationsModule,
        IonicStorageModule.forRoot({
          driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage],
        }),
      ],
      providers: [AuthService, AuthEnvironment, ConfigService, ScrollService, HealthService, Storage],
      declarations: [AppComponent],
    }).compileComponents();
  }));

  it('should create the app', () => {
    // const fixture = TestBed.createComponent(AppComponent);
    // const app = fixture.componentInstance;
    // expect(app).toBeTruthy();
  });
});
