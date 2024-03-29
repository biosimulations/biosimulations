import { Test } from '@nestjs/testing';

import { AppService } from './app.service';
import { beforeAll, it, describe, expect } from '@jest/globals';

describe('AppService', () => {
  let service: AppService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = app.get<AppService>(AppService);
  });

  describe('getData', () => {
    it('should return "Welcome to mail-service!"', () => {
      expect(service.getData()).toEqual({
        message: 'Welcome to mail-service!',
      });
    });
  });
});
