import { Test, TestingModule } from '@nestjs/testing';
import { ResultsController } from './results.controller';
import { ConfigService } from '@nestjs/config';
import { ResultsService } from './results.service';

import { SimulationRunService } from '@biosimulations/dispatch/nest-client';
import { LogService } from './log.service';
import { ArchiverService } from './archiver.service';

class MockSimulationsRunService {
  async sendReport() {}
}
class MockResultsService {
  async method() {}
}
class mockArchiverService {
  async method() {}
}
class mockLogService {
  async sendLog() {}
}

describe('ResultsController', () => {
  let controller: ResultsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResultsController],
      providers: [
        { provide: ResultsService, useClass: MockResultsService },
        { provide: ArchiverService, useClass: mockArchiverService },
        ConfigService,
        { provide: SimulationRunService, useClass: MockSimulationsRunService },
        { provide: LogService, useClass: mockLogService },
      ],
    }).compile();

    controller = module.get<ResultsController>(ResultsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
