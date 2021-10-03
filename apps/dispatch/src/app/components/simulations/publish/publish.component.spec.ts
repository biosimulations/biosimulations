import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishComponent } from './publish.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { SharedUiModule } from '@biosimulations/shared/ui';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IonicStorageModule } from '@ionic/storage-angular';
import { Drivers } from '@ionic/storage';
import { ConfigService, ScrollService } from '@biosimulations/shared/services';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
describe('PublishComponent', () => {
  let component: PublishComponent;
  let fixture: ComponentFixture<PublishComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PublishComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        SharedUiModule,
        BiosimulationsIconsModule,
        IonicStorageModule.forRoot({
          driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage],
        }),
        NoopAnimationsModule,
      ],
      providers: [ConfigService, ScrollService],
      schemas: [],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
