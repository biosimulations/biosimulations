import { Test, TestingModule } from '@nestjs/testing';
import { SpecificationsController } from './specifications.controller';
import { SpecificationsService } from './specifications.service';

describe('SpecificationsController', () => {
  let controller: SpecificationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpecificationsController],
      providers: [{ provide: SpecificationsService, useValue: {} }],
    }).compile();

    controller = module.get<SpecificationsController>(SpecificationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
