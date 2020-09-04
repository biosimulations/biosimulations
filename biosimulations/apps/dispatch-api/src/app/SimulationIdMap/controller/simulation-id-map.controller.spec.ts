import { Test, TestingModule } from '@nestjs/testing';
import { SimulationIdMapController } from './simulation-id-map.controller';

describe('SimulationIdMapController', () => {
  let app: TestingModule;
  let controller: SimulationIdMapController;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [SimulationIdMapController],
    }).compile();

    controller = app.get<SimulationIdMapController>(SimulationIdMapController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
