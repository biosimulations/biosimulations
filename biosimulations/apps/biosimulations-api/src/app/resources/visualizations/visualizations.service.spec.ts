import { Test, TestingModule } from '@nestjs/testing';
import { VisualizationsService } from './visualizations.service';

describe('VisualizationsService', () => {
  let service: VisualizationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VisualizationsService],
    }).compile();

    service = module.get<VisualizationsService>(VisualizationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
