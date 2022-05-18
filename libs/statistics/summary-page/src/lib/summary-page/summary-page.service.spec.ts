import { TestBed } from '@angular/core/testing';

import { SummaryPageService } from './summary-page.service';

describe('SummaryPageService', () => {
  let service: SummaryPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SummaryPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
