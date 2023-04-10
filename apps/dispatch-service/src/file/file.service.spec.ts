import { BiosimulationsConfigModule } from '@biosimulations/config/nest';
import { SimulationRunService } from '@biosimulations/api-nest-client';
import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { CombineWrapperService } from '../combineWrapper.service';
import { FileService } from './file.service';
import { SimulationStorageService } from '@biosimulations/shared/storage';
import { ManifestService } from '../manifest/manifest.service';
import { beforeEach, it, describe, expect } from '@jest/globals';

describe('FileService', () => {
  let service: FileService;

  class mockStorage {
    putObject() {}
    getObject() {}
    deleteObject() {}
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [BiosimulationsConfigModule, HttpModule],

      providers: [
        FileService,
        { provide: CombineWrapperService, useValue: {} },
        { provide: SimulationRunService, useValue: {} },
        { provide: SimulationStorageService, useClass: mockStorage },
        { provide: ManifestService, useValue: {} },
      ],
    }).compile();

    service = module.get<FileService>(FileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
