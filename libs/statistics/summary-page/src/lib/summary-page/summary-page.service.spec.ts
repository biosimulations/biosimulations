import { TestBed } from '@angular/core/testing';

import { SummaryPageService } from './summary-page.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
describe('SummaryPageService', () => {
  let service: SummaryPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SummaryPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
