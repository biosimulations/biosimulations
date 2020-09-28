import { Test } from '@nestjs/testing';
import { OntologyOntologiesController } from './ontology-ontologies.controller';
import { OntologiesService } from './ontology-ontologies.service';

describe('OntologyOntologiesController', () => {
  let controller: OntologyOntologiesController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [OntologiesService],
      controllers: [OntologyOntologiesController],
    }).compile();

    controller = module.get(OntologyOntologiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
