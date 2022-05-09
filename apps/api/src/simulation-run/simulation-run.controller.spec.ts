import { BiosimulationsAuthModule } from '@biosimulations/auth/nest';
import { Test, TestingModule } from '@nestjs/testing';
import { SimulationRunController } from './simulation-run.controller';
import { SimulationRunService } from './simulation-run.service';
import { BiosimulationsConfigModule } from '@biosimulations/config/nest';
import { SharedNatsClientModule } from '@biosimulations/shared/nats-client';
import { HttpModule } from '@nestjs/axios';
import { SimulationRunValidationService } from './simulation-run-validation.service';
import { JobQueue } from '@biosimulations/messages/messages';
/**
 * @file Test file for controller
 * @author Bilal Shaikh
 * @copyright BioSimulations Team, 2020
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
  class resolveCombineArchiveQueue {
    add(job: any) {}
  }
  class dispatchQueue {
    add(job: any) {}
  }
  const queueToken = `BullQueue_${JobQueue.submitSimulationRun}`;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SimulationRunController],
      imports: [BiosimulationsAuthModule, BiosimulationsConfigModule, SharedNatsClientModule, HttpModule],
      providers: [
        { provide: SimulationRunService, useClass: mockSimService },
        { provide: SimulationRunValidationService, useClass: mockSimService },
        { provide: queueToken, useClass: dispatchQueue },
      ],
    }).compile();

    controller = module.get<SimulationRunController>(SimulationRunController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
