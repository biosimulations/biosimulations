import { Test, TestingModule } from '@nestjs/testing';
import { SimulationResultsService } from './simulation-results.service';
import { ConfigService } from '@nestjs/config';

import { SshService } from '../app/services/ssh/ssh.service';

class MockSSHService {
  updateSimulationRunResultsSize(id: string, size: number) {}
}

describe('SimulationResultsService', () => {
  let service: SimulationResultsService;

  beforeEach(async () => {
    const mockHttp = {};
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SimulationResultsService,

        {
          provide: SshService,
          useClass: MockSSHService,
        },

        ConfigService,
      ],
    }).compile();
    service = module.get<SimulationResultsService>(SimulationResultsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
