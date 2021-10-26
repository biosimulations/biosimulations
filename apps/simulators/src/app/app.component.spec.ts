import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { IonicStorageModule } from '@ionic/storage-angular';
import { Drivers } from '@ionic/storage';
import { Storage } from '@ionic/storage-angular';
import { ConfigService, ScrollService } from '@biosimulations/shared/angular';
describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        SharedUiModule,
        HttpClientTestingModule,
        NoopAnimationsModule,
        IonicStorageModule.forRoot({
          driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage],
        }),
      ],
      declarations: [AppComponent],
      providers: [ConfigService, ScrollService, Storage],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  /*
  it(`should have as title 'simulators'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('simulators');
  });
  */
});
