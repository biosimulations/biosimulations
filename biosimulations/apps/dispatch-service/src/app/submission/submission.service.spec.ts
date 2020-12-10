import { TestBed } from '@angular/core/testing';

import { SubmissionService } from './submission.service';

describe('SubmissionService', () => {
  let service: SubmissionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubmissionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
