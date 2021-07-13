import { Test, TestingModule } from '@nestjs/testing';
import { SimulatorsService } from './simulators.service';

describe('SimulatorsService', () => {
  let service: SimulatorsService;

  class MockSimulatorModel {
    constructor(private data = {}) {}
    find() {
      return this.data;
    }
    exec() {
      return this;
    }
    lean() {
      return this;
    }
    static find(filter: any, projection: any, data: any) {}
  }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SimulatorsService,
        { provide: 'SimulatorModel', useValue: {} },
      ],
    }).compile();

    service = module.get<SimulatorsService>(SimulatorsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
