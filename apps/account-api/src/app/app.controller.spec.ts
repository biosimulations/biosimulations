import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from './app.controller';
import { BiosimulationsConfigModule } from '@biosimulations/config/nest';
import { ConfigService } from '@nestjs/config';
import { Account } from './account.model';
import { BiosimulationsAuthModule } from '@biosimulations/auth/nest';
import { AppService } from './app.service';
import {
  AccountManagementModule,
  ManagementService,
} from '@biosimulations/account/management';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [BiosimulationsConfigModule, BiosimulationsAuthModule],
      providers: [
        { provide: AppService, useValue: {} },
        { provide: ManagementService, useValue: {} },
      ],
      controllers: [AppController],
    }).compile();
  });

  describe('createUser', () => {
    it('should return username of created user', () => {});
  });
});
