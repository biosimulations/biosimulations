import { Test, TestingModule } from '@nestjs/testing';
import { ResultsController } from './results.controller';
import { ConfigService } from '@nestjs/config';
import { ResultsService } from './results.service';
import { SimulationRunService } from '../simulation-run/simulation-run.service';

class MockSimulationsRunService {
  async sendReport() {}
}
describe('ResultsController', () => {
  let controller: ResultsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResultsController],
      providers: [
        ResultsService,
        ConfigService,
        { provide: SimulationRunService, useClass: MockSimulationsRunService }
      ]
    }).compile();

    controller = module.get<ResultsController>(ResultsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
