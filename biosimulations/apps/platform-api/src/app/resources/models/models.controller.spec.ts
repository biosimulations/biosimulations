import { Test, TestingModule } from '@nestjs/testing';
import { ModelsController } from './models.controller';
import { ModelsService } from './models.service';
import { CacheModule } from '@nestjs/common';
import { BiosimulationsAuthModule } from '@biosimulations/auth/nest';
import { BiosimulationsConfigModule } from '@biosimulations/config/nest';

describe('Models Controller', () => {
  let controller: ModelsController;

  beforeEach(async () => {
    const mockService = {};
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        CacheModule.register(),
        BiosimulationsAuthModule,
        BiosimulationsConfigModule,
      ],
      controllers: [ModelsController],
      providers: [{ provide: ModelsService, useValue: mockService }],
    }).compile();

    controller = module.get<ModelsController>(ModelsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
