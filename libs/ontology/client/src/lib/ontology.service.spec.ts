import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OntologyService } from './ontology.service';
import { ConfigService } from '@biosimulations/config/angular';

describe('OntologyService', () => {
  let service: OntologyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ConfigService],
    });
    service = TestBed.inject(OntologyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
