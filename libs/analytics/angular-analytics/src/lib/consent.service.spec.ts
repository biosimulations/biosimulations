import { TestBed } from '@angular/core/testing';

import { ConsentService } from './consent.service';
import {
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Storage } from '@ionic/storage-angular';
import { ConfigService } from '@biosimulations/config/angular';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ConsentService', () => {
  let service: ConsentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        MatExpansionModule,
        MatSlideToggleModule,
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
          provide: ConfigService,
          useValue: {
            appName: 'testApp',
            analyticsId: 'testId',
          },
        },
      ],
    });
    service = TestBed.inject(ConsentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
