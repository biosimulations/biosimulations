import { Test } from '@nestjs/testing';
import { SharedStorageService } from './shared-storage.service';

describe('SharedStorageService', () => {
  let service: SharedStorageService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [SharedStorageService],
    }).compile();

    service = module.get(SharedStorageService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
