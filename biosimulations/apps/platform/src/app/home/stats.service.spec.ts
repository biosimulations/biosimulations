import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StatsService } from './stats.service';

describe('StatsService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    }),
  );

  it('should be created', () => {
    const service: StatsService = TestBed.get(StatsService);
    expect(service).toBeTruthy();
  });
});
