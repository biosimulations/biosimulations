import { ModelsService } from './../../resources/models/models.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ArchiverService } from './archiver.service';
import { ConfigService } from '@nestjs/config';

describe('ArchiverService', () => {
  let service: ArchiverService;

  beforeEach(async () => {
    const mockService = {};
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArchiverService,
        ConfigService,
        {
        provide: ModelsService,
        useValue: mockService,
      },
    ],
    }).compile();
    service = module.get<ArchiverService>(ArchiverService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
