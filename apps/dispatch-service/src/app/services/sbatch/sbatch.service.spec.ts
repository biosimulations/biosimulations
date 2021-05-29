import { Test, TestingModule } from '@nestjs/testing';
import { SbatchService } from './sbatch.service';
import { BiosimulationsConfigModule } from '@biosimulations/config/nest';
describe('SbatchService', () => {
  let service: SbatchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SbatchService],
      imports: [BiosimulationsConfigModule],
    }).compile();

    service = module.get<SbatchService>(SbatchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
