import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { FileModel } from './files.model';
import { FilesService } from './files.service';
import { SharedStorageService } from '@biosimulations/shared/storage';
import { ConfigService } from '@nestjs/config';

describe('FilesService', () => {
  let service: FilesService;

  class mockStorage {
    putObject() {}
    getObject() {}
    deleteObject() {}
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilesService,
        { provide: getModelToken(FileModel.name), useValue: {} },
        { provide: SharedStorageService, useClass: mockStorage },
        ConfigService,
      ],
    }).compile();

    service = module.get<FilesService>(FilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
