import { Test } from '@nestjs/testing';
import { OntologiesService } from './ontologies.service';

describe('OntologiesService', () => {
  let service: OntologiesService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [OntologiesService],
    }).compile();

    service = module.get(OntologiesService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
