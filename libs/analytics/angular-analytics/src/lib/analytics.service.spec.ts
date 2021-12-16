import { TestBed } from '@angular/core/testing';

import { AnalyticsService } from './analytics.service';
import {
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Storage } from '@ionic/storage-angular';

import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ANALYTICS_ID_TOKEN, APP_NAME_TOKEN } from './datamodel';

describe('AnalyticsService', () => {
  let service: AnalyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        MatExpansionModule,
        MatSlideToggleModule,
        RouterTestingModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        {
          provide: MAT_DIALOG_DATA,
          useValue: undefined,
        },
        Storage,
        {
          provide: APP_NAME_TOKEN,
          useValue: 'testApp',
        },
        {
          provide: ANALYTICS_ID_TOKEN,
          useValue: 'G-1234567891',
        },
      ],
    });
    service = TestBed.inject(AnalyticsService);
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
