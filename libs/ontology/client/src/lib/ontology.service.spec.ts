import { TestBed } from '@angular/core/testing';

import { OntologyService } from './ontology.service';

describe('OntologyService', () => {
  let service: OntologyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OntologyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
