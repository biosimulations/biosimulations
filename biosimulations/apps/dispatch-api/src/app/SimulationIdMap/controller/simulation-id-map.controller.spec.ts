import { Test, TestingModule } from '@nestjs/testing';
import { SimulationIdMapController } from './simulation-id-map.controller';

describe('SimulationIdMapController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [SimulationIdMapController],
    }).compile();
  });
});
