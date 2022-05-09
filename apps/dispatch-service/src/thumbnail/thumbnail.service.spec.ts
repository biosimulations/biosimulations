import { SimulationRunService } from '@biosimulations/api-nest-client';
import { FilePaths, SimulationStorageService } from '@biosimulations/shared/storage';
import { Test, TestingModule } from '@nestjs/testing';
import { ManifestService } from '../manifest/manifest.service';

import { ThumbnailService } from './thumbnail.service';

describe('ThumbnailService', () => {
  let service: ThumbnailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ThumbnailService,
        { provide: FilePaths, useValue: {} },
        {
          provide: ManifestService,
          useValue: {},
        },
        { provide: SimulationStorageService, useValue: {} },
        { provide: SimulationRunService, useValue: {} },
      ],
    }).compile();

    service = module.get<ThumbnailService>(ThumbnailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
