import { Test, TestingModule } from '@nestjs/testing';
import { SimulatorsController } from './simulators.controller';

class MockSimulatorService {}
describe('SimulatorsController', () => {
  let controller: SimulatorsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SimulatorsController],
      providers: [
        { provide: 'SimulatorsService', useClass: MockSimulatorService },
      ],
    }).compile();

    controller = module.get<SimulatorsController>(SimulatorsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
