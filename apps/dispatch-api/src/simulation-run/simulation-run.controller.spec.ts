import { BiosimulationsAuthModule } from '@biosimulations/auth/nest';
import { SimulationResultsFormat } from '@biosimulations/datamodel/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { SimulationFile } from './file.model';
import { SimulationRunController } from './simulation-run.controller';
import { SimulationRunModel } from './simulation-run.model';
import { SimulationRunService } from './simulation-run.service';
import { BiosimulationsConfigModule } from '@biosimulations/config/nest';
import { SharedNatsClientModule } from '@biosimulations/shared/nats-client';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
/**
 * @file Test file for controller
 * @author Bilal Shaikh
 * @copyright Biosimulations Team, 2020
 * @license MIT
 */
describe('SimulationRunsController', () => {
  let controller: SimulationRunController;
  class mockSimService {
    data: any;
    save: () => any;
    constructor(body: any) {
      this.data = body;
      this.save = () => {
        return this.data;
      };
    }
  }
  class dispatchQueue {
    add(job: any) {}
  }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SimulationRunController],
      imports: [
        BiosimulationsAuthModule,
        BiosimulationsConfigModule,
        SharedNatsClientModule,
        HttpModule,
      ],
      providers: [
        { provide: SimulationRunService, useClass: mockSimService },
        { provide: 'BullQueue_dispatch', useClass: dispatchQueue },
      ],
    }).compile();

    controller = module.get<SimulationRunController>(SimulationRunController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
