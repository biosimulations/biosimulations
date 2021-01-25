import { BiosimulationsConfigModule } from '@biosimulations/config/nest';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { SimulationRunModel } from '../simulation-run/simulation-run.model';
import { SimulationRunLog } from './logs.model';
import { LogsService } from './logs.service';

describe('LogsService', () => {
  let service: LogsService;
  class mockLogModel {
    data: any;
    save: () => any;
    constructor(body: any) {
      this.data = body;
      this.save = () => {
        return this.data;
      };
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LogsService,
        {
          provide: getModelToken(SimulationRunLog.name),
          useClass: mockLogModel
        }
      ],
      imports: [BiosimulationsConfigModule]
    }).compile();

    service = module.get<LogsService>(LogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
