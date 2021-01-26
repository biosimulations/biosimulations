import { SimulationRunService } from '@biosimulations/dispatch/nest-client';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Test, TestingModule } from '@nestjs/testing';
import { HpcService } from '../services/hpc/hpc.service';

import { SubmissionService } from './submission.service';

class MockSimulationService {
  updateSimulationRunStatus(id: string, size: number) {}
}
class mockHPCService {
  getJobStatus(id: string) {}
}
class mockClient {
  emit(message: any) {}
}
describe('Submissionservice', () => {
  let service: SubmissionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubmissionService,
        { provide: SimulationRunService, useClass: MockSimulationService },
        {
          provide: HpcService,
          useClass: mockHPCService,
        },
        SchedulerRegistry,
        { provide: 'NATS_CLIENT', useClass: mockClient },
      ],
    }).compile();

    service = module.get<SubmissionService>(SubmissionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
