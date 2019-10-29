import { TestBed } from '@angular/core/testing';

import { FileService } from './file.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule, MatFooterCell } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';

describe('FileService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule, RouterTestingModule],
      providers: [
        HttpClientTestingModule,
        MatDialogModule,
        RouterTestingModule,
      ],
    })
  );

  it('should be created', () => {
    const service: FileService = TestBed.get(FileService);
    expect(service).toBeTruthy();
  });
});
