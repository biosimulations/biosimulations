import { Test, TestingModule } from '@nestjs/testing';
import { SshService } from './ssh.service';
import { ConfigService } from '@nestjs/config';
import { beforeEach, it, describe, expect } from '@jest/globals';

class mockConfigService {
  get(key: string, defaultValue = undefined) {
    if (key == 'hpc.sshInit') {
      return 'false';
    }
  }
}
describe('SshService', () => {
  let service: SshService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SshService, { provide: ConfigService, useClass: mockConfigService }],
    }).compile();

    service = module.get<SshService>(SshService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
