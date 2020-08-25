import { Test, TestingModule } from '@nestjs/testing';
import { SimulatorsController } from './simulators.controller';

describe('SimulatorsController', () => {
  let controller: SimulatorsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SimulatorsController],
    }).compile();

    controller = module.get<SimulatorsController>(SimulatorsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
