import { Test, TestingModule } from '@nestjs/testing';
import { ArchiverService } from './archiver.service';
import { ConfigService } from '@nestjs/config';

import { HttpService } from '@nestjs/axios';
import { SimulationRunService } from '@biosimulations/dispatch/nest-client';
import { SshService } from '../services/ssh/ssh.service';
import { FileService } from './file.service';

class MockSimulationService {
  updateSimulationRunResultsSize(id: string, size: number) {}
}
class MockFileService {
  updateSimulationRunResultsSize(id: string, size: number) {}
}
class MockSSHService {
  updateSimulationRunResultsSize(id: string, size: number) {}
}
describe('ArchiverService', () => {
  let service: ArchiverService;

  beforeEach(async () => {
    const mockHttp = {};
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArchiverService,

        {
          provide: SshService,
          useClass: MockSSHService,
        },
        {
          provide: FileService,
          useClass: MockFileService,
        },
        {
          provide: SimulationRunService,
          useClass: MockSimulationService,
        },
      ],
    }).compile();
    service = module.get<ArchiverService>(ArchiverService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
