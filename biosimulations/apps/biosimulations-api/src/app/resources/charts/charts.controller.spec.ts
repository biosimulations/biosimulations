import { Test, TestingModule } from '@nestjs/testing';
import { ChartsController } from './charts.controller';

describe('Charts Controller', () => {
  let controller: ChartsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChartsController],
    }).compile();

    controller = module.get<ChartsController>(ChartsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
