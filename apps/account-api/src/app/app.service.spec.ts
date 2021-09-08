import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { BiosimulationsConfigModule } from '@biosimulations/config/nest';
import { Account } from './account.model';

import { ManagementService } from '@biosimulations/account/management';
import { getModelToken } from '@nestjs/mongoose';

describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [BiosimulationsConfigModule],
      providers: [
        AppService,
        { provide: ManagementService, useValue: {} },
        { provide: getModelToken(Account.name), useValue: {} },
      ],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
