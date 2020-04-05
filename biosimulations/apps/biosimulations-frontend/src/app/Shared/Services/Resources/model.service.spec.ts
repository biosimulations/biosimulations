import { TestBed } from '@angular/core/testing';

import { ModelService } from './model.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';

describe('ModelService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, MatDialogModule],
      providers: [HttpClientTestingModule, RouterTestingModule, MatDialogModule],
    })
  );

  it('should be created', () => {
    const service: ModelService = TestBed.get(ModelService);
    expect(service).toBeTruthy();
  });
});
