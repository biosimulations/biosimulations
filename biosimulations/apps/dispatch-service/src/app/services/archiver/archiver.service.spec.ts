import { ModelsService } from './../../resources/models/models.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ArchiverService } from './archiver.service';
import { ConfigService } from '@nestjs/config';
import { AppService } from '../../app.service';
import { HttpService } from '@nestjs/common';

describe('ArchiverService', () => {
  let service: ArchiverService;

  beforeEach(async () => {
    const mockService = {};
    const mockHttp = {};
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArchiverService,
        AppService,
        {
          provide: HttpService,
          useValue: mockHttp,
        },
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
