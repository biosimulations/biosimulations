import { Test, TestingModule } from '@nestjs/testing';
import { SimulatorsService } from './simulators.service';
import { beforeEach, it, describe, expect } from '@jest/globals';

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
      providers: [SimulatorsService, { provide: 'SimulatorModel', useValue: MockSimulatorModel }],
    }).compile();

    service = module.get<SimulatorsService>(SimulatorsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
