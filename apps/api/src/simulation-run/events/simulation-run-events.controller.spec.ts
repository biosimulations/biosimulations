import { Test, TestingModule } from '@nestjs/testing';
import { SimulationRunEventsController } from './simulation-run-events.controller';

describe('SimulationRunEventsController', () => {
  let controller: SimulationRunEventsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SimulationRunEventsController],
    }).compile();

    controller = module.get<SimulationRunEventsController>(SimulationRunEventsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
