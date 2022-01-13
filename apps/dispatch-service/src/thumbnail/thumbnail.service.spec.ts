import { Test, TestingModule } from '@nestjs/testing';
import { ThumbnailService } from './thumbnail.service';

describe('ThumbnailService', () => {
  let service: ThumbnailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ThumbnailService],
    }).compile();

    service = module.get<ThumbnailService>(ThumbnailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
