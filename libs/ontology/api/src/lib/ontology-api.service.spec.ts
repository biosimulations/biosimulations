import { Test } from '@nestjs/testing';
import { OntologyApiService } from './ontology-api.service';

describe('OntologyApiService', () => {
  let service: OntologyApiService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [OntologyApiService],
    }).compile();

    service = module.get(OntologyApiService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
