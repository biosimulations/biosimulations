import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { SimulationRunModel } from '../simulation-run/simulation-run.model';
import { SimulationRunMetadataModel } from './metadata.model';
import { MetadataService } from './metadata.service';

class MockModel {}
describe('MetadataService', () => {
  let service: MetadataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MetadataService,
        {
          provide: getModelToken(SimulationRunMetadataModel.name),
          useClass: MockModel,
        },
        {
          provide: getModelToken(SimulationRunModel.name),
          useClass: MockModel,
        },
      ],
    }).compile();

    service = module.get<MetadataService>(MetadataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
