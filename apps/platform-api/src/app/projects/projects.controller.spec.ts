import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsController } from './projects.controller';

describe('ModelsController', () => {
  let controller: ProjectsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsController],
    }).compile();

    controller = module.get<ProjectsController>(ProjectsController);
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
