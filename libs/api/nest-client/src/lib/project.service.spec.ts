import { Test, TestingModule } from '@nestjs/testing';

import { ProjectService } from './project.service';
import { BiosimulationsConfigModule } from '@biosimulations/config/nest';
import { HttpService } from '@nestjs/axios';
import { AuthClientService } from '@biosimulations/auth/client';

class MockAuthService {
  getToken(audience = 'audience') {
    return 'Token String';
  }
}

describe('ProjectService', () => {
  let service: ProjectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [BiosimulationsConfigModule],
      providers: [
        ProjectService,
        { provide: AuthClientService, useClass: MockAuthService },
        { provide: HttpService, useClass: MockAuthService },
      ],
    }).compile();

    service = module.get<ProjectService>(ProjectService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
