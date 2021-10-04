import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { SpecificationsModel } from './specifications.model';
import { SpecificationsService } from './specifications.service';

describe('SpecificationsService', () => {
  let service: SpecificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SpecificationsService,
        { provide: getModelToken(SpecificationsModel.name), useValue: {} },
      ],
    }).compile();

    service = module.get<SpecificationsService>(SpecificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
