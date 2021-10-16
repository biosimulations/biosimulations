import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SystemStatusService } from './system-status.service';

describe('SystemStatusService', () => {
  let service: SystemStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SystemStatusService],
    });
    service = TestBed.inject(SystemStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
