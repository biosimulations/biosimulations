import { Test } from '@nestjs/testing';
import { BiosimulationsConfigModule } from '@biosimulations/config/nest';
import { S3Module } from 'nestjs-s3';
import { SharedStorageService } from './shared-storage.service';

describe('SharedStorageService', () => {
  let service: SharedStorageService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        BiosimulationsConfigModule,
        S3Module.forRoot({
          config: {
            credentials: {
              accessKeyId: '',
              secretAccessKey: '',
            },
            endpoint: '',
            s3ForcePathStyle: true,
            region: 'us-east-1',
          },
        }),
      ],
      providers: [SharedStorageService],
    }).compile();

    service = module.get(SharedStorageService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
