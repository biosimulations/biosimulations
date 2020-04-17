import { Test } from '@nestjs/testing';

import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';

describe('AppService', () => {
  let service: AppService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [AppService, ConfigService],
    }).compile();

    service = app.get<AppService>(AppService);
  });

  describe('getData', () => {
    it('should return "Welcome to biosimulations-api!"', () => {
      expect(service.getData()).toEqual({
        message: 'Welcome to biosimulations-api!',
      });
    });
  });
});
