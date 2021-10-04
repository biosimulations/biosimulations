import { BiosimulationsConfigModule } from '@biosimulations/config/nest';
import { SimulationRunService } from '@biosimulations/dispatch/nest-client';
import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { CombineWrapperService } from '../combineWrapper.service';
import { FileService } from './file.service';

describe('FileService', () => {
  let service: FileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [BiosimulationsConfigModule, HttpModule],

      providers: [
        FileService,
        { provide: CombineWrapperService, useValue: {} },
        { provide: SimulationRunService, useValue: {} },
      ],
    }).compile();

    service = module.get<FileService>(FileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
