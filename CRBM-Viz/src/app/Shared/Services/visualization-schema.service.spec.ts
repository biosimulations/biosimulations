import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { VisualizationSchemaService } from './visualization-schema.service';

describe('VisualizationSchemaService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HttpClientTestingModule],
    })
  );

  it('should be created', () => {
    const service: VisualizationSchemaService = TestBed.get(VisualizationSchemaService);
    expect(service).toBeTruthy();
  });
});
