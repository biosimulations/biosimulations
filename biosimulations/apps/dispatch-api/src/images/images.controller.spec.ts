import { BiosimulationsAuthModule } from '@biosimulations/auth/nest';
import { BiosimulationsConfigModule } from '@biosimulations/config/nest';
import { SharedNatsClientModule } from '@biosimulations/shared/nats-client';
import { Test, TestingModule } from '@nestjs/testing';
import { ImagesController } from './images.controller';

describe('ImagesController', () => {
  let controller: ImagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImagesController],
      imports: [BiosimulationsAuthModule, BiosimulationsConfigModule, SharedNatsClientModule],
    }).compile();

    controller = module.get<ImagesController>(ImagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
