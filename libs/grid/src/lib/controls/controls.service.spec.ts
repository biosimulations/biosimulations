import { TestBed } from '@angular/core/testing';

import { ControlsService } from './controls.service';

describe('FilterService', () => {
  let service: ControlsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ControlsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
