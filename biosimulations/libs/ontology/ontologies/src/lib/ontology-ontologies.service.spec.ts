import { Test } from '@nestjs/testing';
import { OntologyOntologiesService } from './ontology-ontologies.service';

describe('OntologyOntologiesService', () => {
  let service: OntologyOntologiesService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [OntologyOntologiesService],
    }).compile();

    service = module.get(OntologyOntologiesService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
