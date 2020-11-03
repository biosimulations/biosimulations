import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { BiosimulationsAuthModule } from '@biosimulations/auth/nest';
import { BiosimulationsConfigModule } from '@biosimulations/config/nest';
describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [
        ConfigModule,
        BiosimulationsAuthModule,
        BiosimulationsConfigModule,
      ],
      controllers: [AppController],
      providers: [AppService],
    }).compile();
  });

  describe('ping', () => {
    it('should return "pong', () => {
      const appController = app.get<AppController>(AppController);
      expect(appController.getData()).toEqual('pong');
    });
  });
});
