import { SimulationRunService } from '@biosimulations/api-nest-client';
import { MailClientService } from '@biosimulations/mail-service/client';
import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from './app.controller';
import { AppService } from './app.service';
class MockMailClient {
  sendEmail() {}
}
class MockAppService {
  getJob() {}
}
describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        { provide: SimulationRunService, useValue: MockAppService },
        { provide: AppService, useClass: MockAppService },
        { provide: MailClientService, useClass: MockMailClient },
      ],
    }).compile();
  });

  describe('getData', () => {
    it('should build', () => {
      const appController = app.get<AppController>(AppController);
      expect(appController).toBeTruthy();
    });
  });
});
