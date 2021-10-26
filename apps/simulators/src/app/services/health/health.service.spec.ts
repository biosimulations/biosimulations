import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HealthService } from './health.service';

describe('HealthService', () => {
  let service: HealthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HealthService],
    });
    service = TestBed.inject(HealthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
