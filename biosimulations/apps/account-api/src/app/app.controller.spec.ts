import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from './app.controller';


describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],

    }).compile();
  });

  describe('getData', () => {
    it('should return "Welcome to account-api!"', () => {
      const appController = app.get<AppController>(AppController);
      expect(appController.getData()).toEqual({
        message: 'Welcome to account-api!',
      });
    });
  });

  describe('createUser', () => {
    it('should return username of created user', () => {
      const appController = app.get<AppController>(AppController);
      expect(appController.createAccount('bilalShaikh42', 'testToken')).toEqual('bilalShaikh42')
    })
  })
});
