import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { ConfigService } from '@nestjs/config';


describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [ConfigService],
    }).compile();
  });

  describe('getData', () => {
    it('should return "No file provided!"', () => {
      const appController = app.get<AppController>(AppController);
      expect(appController.uploadFile(null,{simulator: 'copasi'})).toEqual({
        message: 'No file provided!'
      });
    });
  });
});
