import { Test, TestingModule } from '@nestjs/testing';
import { SpecificationsController } from './specifications.controller';
import { SpecificationsService } from './specifications.service';
import { BiosimulationsAuthModule } from '@biosimulations/auth/nest';
import { BiosimulationsConfigModule } from '@biosimulations/config/nest';
import { SharedNatsClientModule } from '@biosimulations/shared/nats-client';

describe('SpecificationsController', () => {
  let controller: SpecificationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpecificationsController],
      imports: [
        BiosimulationsAuthModule,
        BiosimulationsConfigModule,
        SharedNatsClientModule,
      ],
      providers: [{ provide: SpecificationsService, useValue: {} }],
    }).compile();

    controller = module.get<SpecificationsController>(SpecificationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
