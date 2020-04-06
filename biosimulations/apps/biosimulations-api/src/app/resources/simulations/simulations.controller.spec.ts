import { Test, TestingModule } from '@nestjs/testing';
import { SimulationsController } from './simulations.controller';

describe('Simulations Controller', () => {
  let controller: SimulationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SimulationsController],
    }).compile();

    controller = module.get<SimulationsController>(SimulationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
