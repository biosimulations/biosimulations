import { Test, TestingModule } from '@nestjs/testing';

import { SimulationRunService } from './simulation-run.service';
import { BiosimulationsConfigModule } from '@biosimulations/config/nest';
import { HttpService } from '@nestjs/axios';
import { AuthClientService } from '@biosimulations/auth/client';
class MockAuthService {
  getToken(audience = 'audience') {
    return 'Token String';
  }
}

describe('SimulationRunServiceService', () => {
  let service: SimulationRunService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [BiosimulationsConfigModule],
      providers: [
        SimulationRunService,
        { provide: AuthClientService, useClass: MockAuthService },
        { provide: HttpService, useClass: MockAuthService },
      ],
    }).compile();

    service = module.get<SimulationRunService>(SimulationRunService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
