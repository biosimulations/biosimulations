import { Test } from '@nestjs/testing';
import { OntologyOntologiesController } from './ontology-ontologies.controller';
import { OntologyOntologiesService } from './ontology-ontologies.service';

describe('OntologyOntologiesController', () => {
  let controller: OntologyOntologiesController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [OntologyOntologiesService],
      controllers: [OntologyOntologiesController],
    }).compile();

    controller = module.get(OntologyOntologiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
