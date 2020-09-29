import { Test } from '@nestjs/testing';
import { OntologiesController } from './ontologies.controller';
import { OntologiesService } from './ontologies.service';

describe('OntologiesController', () => {
  let controller: OntologiesController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [OntologiesService],
      controllers: [OntologiesController],
    }).compile();

    controller = module.get(OntologiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
