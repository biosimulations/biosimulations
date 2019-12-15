import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ChartTypeService } from './chart-type.service';

describe('ChartTypeService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HttpClientTestingModule],
    })
  );

  it('should be created', () => {
    const service: ChartTypeService = TestBed.get(ChartTypeService);
    expect(service).toBeTruthy();
  });
});
