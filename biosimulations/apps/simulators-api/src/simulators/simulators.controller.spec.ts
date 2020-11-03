import {
  AdminGuard,
  BiosimulationsAuthModule,
} from '@biosimulations/auth/nest';
import { Test, TestingModule } from '@nestjs/testing';
import { SimulatorsController } from './simulators.controller';

class MockSimulatorService {}
describe('SimulatorsController', () => {
  let controller: SimulatorsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SimulatorsController, BiosimulationsAuthModule],
      providers: [
        { provide: 'SimulatorsService', useClass: MockSimulatorService },
        AdminGuard,
      ],
    }).compile();

    controller = module.get<SimulatorsController>(SimulatorsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
