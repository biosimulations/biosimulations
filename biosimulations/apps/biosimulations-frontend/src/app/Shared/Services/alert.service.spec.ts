import { TestBed } from '@angular/core/testing';

import { AlertService } from './alert.service';
import { MatDialogModule } from '@angular/material/dialog';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('AlertService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [MatDialogModule],
      providers: [MatDialogModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
  );

  it('should be created', () => {
    const service: AlertService = TestBed.get(AlertService);
    expect(service).toBeTruthy();
  });
});
