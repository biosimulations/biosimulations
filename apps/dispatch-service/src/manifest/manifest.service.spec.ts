import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { CombineWrapperService } from '../combineWrapper.service';
import { ManifestService } from './manifest.service';
import { FilePaths } from '@biosimulations/shared/storage';

describe('ManifestService', () => {
  let service: ManifestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ManifestService,
        ConfigService,
        { provide: CombineWrapperService, useValue: {} },
        { provide: FilePaths, useValue: {} },
      ],
    }).compile();

    service = module.get<ManifestService>(ManifestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
