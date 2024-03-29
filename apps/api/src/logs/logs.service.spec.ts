import { BiosimulationsConfigModule } from '@biosimulations/config/nest';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Server } from 'http';
import { SimulationRunModel } from '../simulation-run/simulation-run.model';
import { SimulationRunLog, CombineArchiveLog } from './logs.model';
import { LogsService } from './logs.service';
import { beforeEach, it, describe, expect, jest } from '@jest/globals';

describe('LogsService', () => {
  let service: LogsService;
  class mockModel {
    constructor(private data: any) {}
    static save = jest.fn<() => Promise<object>>().mockResolvedValue({
      toObject: jest.fn<() => Promise<object>>().mockResolvedValue({}),
    });
    save = mockModel.save;
    static find = jest.fn<() => Promise<object>>().mockResolvedValue({});
    static findOne = jest.fn<() => Promise<object>>().mockResolvedValue({});
    static findOneAndUpdate = jest.fn<() => Promise<object>>().mockResolvedValue({});
    static deleteOne = jest.fn<() => Promise<boolean>>().mockResolvedValue(true);
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LogsService,
        {
          provide: getModelToken(SimulationRunLog.name),
          useValue: mockModel,
        },
        {
          provide: getModelToken(CombineArchiveLog.name),
          useValue: mockModel,
        },
      ],
      imports: [BiosimulationsConfigModule],
    }).compile();

    service = module.get<LogsService>(LogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should save to database', () => {
    //@ts-ignore
    const spy = jest.spyOn(service.logModel, 'save');

    //@ts-ignore
    service.createLog('testId', { data: test });

    expect(spy).toHaveBeenCalled();
  });
});
