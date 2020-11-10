import { Test, TestingModule } from '@nestjs/testing';
import { SimulationRunController } from './simulation-run.controller';

describe('SimulationRunsController', () => {
  let controller: SimulationRunController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SimulationRunController],
    }).compile();

    controller = module.get<SimulationRunController>(SimulationRunController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
