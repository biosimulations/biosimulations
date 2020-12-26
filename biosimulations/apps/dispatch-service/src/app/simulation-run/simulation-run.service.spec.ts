import { HttpService } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../services/auth/auth.service';
import { SimulationRunService } from './simulation-run.service';

class mockAuthService {
  getToken() {
    return 'token';
  }
}
class mockHttpSerivice {
  post(url: string, body: any) {}
}
describe('SimulationRunservice', () => {
  let service: SimulationRunService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SimulationRunService,
        { provide: AuthService, useClass: mockAuthService },
        { provide: HttpService, useClass: mockHttpSerivice },
      ],
    }).compile();

    service = module.get<SimulationRunService>(SimulationRunService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
