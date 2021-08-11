/**
 * @file Contains tests for the simulation run service
 * @author Bilal Shaikh
 * @copyright Biosimulations Team, 2020
 * @license MIT
 */
import { BiosimulationsConfigModule } from '@biosimulations/config/nest';
import { SharedNatsClientModule } from '@biosimulations/shared/nats-client';
import {
  SharedStorageModule,
  SharedStorageService,
} from '@biosimulations/shared/storage';
import { HttpModule } from '@nestjs/axios';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

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
  class mockStorage {
    putObject() {}
    getObject() {}
  }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, SharedNatsClientModule, BiosimulationsConfigModule],
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
        { provide: SharedStorageService, useClass: mockStorage },
      ],
    }).compile();

    service = module.get<SimulationRunService>(SimulationRunService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
