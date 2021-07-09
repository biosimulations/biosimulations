import {
  AdminGuard,
  BiosimulationsAuthModule,
} from '@biosimulations/auth/nest';
import { Test, TestingModule } from '@nestjs/testing';
import { SimulatorsController } from './simulators.controller';

class MockSimulatorService {
  findAll() {
    return [
      {
        id: 'sim1',
        version: '1.7',
      },
      {
        id: 'sim1',
        version: '1.11',
      },
      {
        id: 'sim2',
        version: '1.1',
      },
      {
        id: 'sim2',
        version: '1.2',
      },
      {
        id: 'sim3',
        version: '1.7',
      },
      {
        id: 'sim4',
        version: '2020-01-05',
      },
      {
        id: 'sim4',
        version: '2020-02-01',
      },
    ];
  }
}
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

  it('should return the correct latest version', async () => {
    const latest = await controller.getLatestSimulators('sim1');
    expect(latest[0].version).toBe('1.11');
  });

  it('should return the correct latest versions', async () => {
    const latest = await controller.getLatestSimulators();
    console.log(latest);
    expect(latest[0].version).toBe('1.11');
    expect(latest[1].version).toBe('1.2');
    expect(latest[2].version).toBe('1.7');
    expect(latest[3].version).toBe('2020-02-01');
  });
});
