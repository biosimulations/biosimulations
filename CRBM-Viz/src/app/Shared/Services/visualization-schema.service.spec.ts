import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { VisualizationSchemaSevice } from './visualization-schema.service';

describe('VisualizationSchemaSevice', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HttpClientTestingModule],
    })
  );

  it('should be created', () => {
    const service: VisualizationSchemaSevice = TestBed.get(VisualizationSchemaSevice);
    expect(service).toBeTruthy();
  });
});
