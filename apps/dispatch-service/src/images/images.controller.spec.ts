import { JobQueue, BullModuleOptions } from '@biosimulations/messages/messages';
import { BullModule } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { SbatchService } from '../app/services/sbatch/sbatch.service';
import { SshService } from '../app/services/ssh/ssh.service';
import { ImagesController } from './images.controller';
import { beforeEach, it, describe, expect } from '@jest/globals';

class MockSbatchService {
  async method() {}
}
class MockSshService {
  async method() {}
}
class MockConfigService {
  async method() {}
}
describe('ImagesController', () => {
  let controller: ImagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImagesController],
      imports: [
        BullModule.registerQueueAsync({
          name: JobQueue.refreshImages,
          ...BullModuleOptions,
        }),
      ],
      providers: [
        { provide: SbatchService, useClass: MockSbatchService },
        { provide: ConfigService, useClass: MockConfigService },
        { provide: SshService, useClass: MockSshService },
      ],
    }).compile();

    controller = module.get<ImagesController>(ImagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
