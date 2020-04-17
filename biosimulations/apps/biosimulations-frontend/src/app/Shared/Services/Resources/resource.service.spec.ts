import { TestBed } from '@angular/core/testing';

import { ResourceService } from './resource.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { TopLevelResource } from '../../Models/top-level-resource';

describe('ResourceService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, MatDialogModule],
    }),
  );

  it('should be created', () => {});
});
