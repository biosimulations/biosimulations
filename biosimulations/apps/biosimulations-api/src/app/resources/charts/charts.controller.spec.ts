import { Test, TestingModule } from '@nestjs/testing';
import { ChartsController } from './charts.controller';
import { ChartsService } from './charts.service';

describe('Charts Controller', () => {
  let controller: ChartsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChartsController],
      providers: [ChartsService],
    }).compile();

    controller = module.get<ChartsController>(ChartsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
