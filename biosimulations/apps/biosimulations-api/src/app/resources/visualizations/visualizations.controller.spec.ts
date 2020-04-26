import { Test, TestingModule } from '@nestjs/testing';
import { VisualizationsController } from './visualizations.controller';
import { VisualizationsService } from './visualizations.service';

describe('Visualizations Controller', () => {
  let controller: VisualizationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VisualizationsController],
      providers: [VisualizationsService],
      imports: [VisualizationsService],
    }).compile();

    controller = module.get<VisualizationsController>(VisualizationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
