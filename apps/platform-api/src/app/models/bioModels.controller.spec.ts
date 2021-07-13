import { Test, TestingModule } from '@nestjs/testing';
import { BioModelsController } from './bioModels.controller';

describe('ModelsController', () => {
  let controller: BioModelsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BioModelsController],
    }).compile();

    controller = module.get<BioModelsController>(BioModelsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return model with id', () => {
    expect(
      controller.makeModel({ simulationRun: 'exampleSim' }).id,
    ).toBeDefined();
  });
});
