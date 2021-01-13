import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { SbatchService } from '../app/services/sbatch/sbatch.service';
import { SshService } from '../app/services/ssh/ssh.service';
import { ImagesController } from './images.controller';


class MockSbatchService {
  async method() { }
}
class MockSshService {
  async method() { }
}
class MockConfigService {
  async method() { }
}
describe('ImagesController', () => {
  let controller: ImagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImagesController],
      providers: [{ provide: SbatchService, useClass: MockSbatchService }, { provide: ConfigService, useClass: MockConfigService }, { provide: SshService, useClass: MockSshService }]
    }).compile();

    controller = module.get<ImagesController>(ImagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
