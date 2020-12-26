/**
 * @file Contains tests for the simulation run service
 * @author Bilal Shaikh
 * @copyright Biosimulations Team, 2020
 * @license MIT
 */
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from 'nestjs-typegoose';
import { SimulationFile } from './file.model';
import { SimulationRunModel } from './simulation-run.model';
import { SimulationRunService } from './simulation-run.service';

describe('SimulationRunService', () => {
  let service: SimulationRunService;
  class mockFile {
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
        SimulationRunService,
        {
          provide: getModelToken(SimulationFile.name),
          useClass: mockFile,
        },
        {
          provide: getModelToken(SimulationRunModel.name),
          useClass: mockFile,
        },
      ],
    }).compile();

    service = module.get<SimulationRunService>(SimulationRunService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
