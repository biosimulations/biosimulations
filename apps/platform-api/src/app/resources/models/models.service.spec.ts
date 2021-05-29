import { Test, TestingModule } from '@nestjs/testing';
import { ModelsService } from './models.service';
import { getModelToken } from 'nestjs-typegoose';
describe('ModelsService', () => {
  let service: ModelsService;
  const mockModel = {};
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ModelsService,
        { provide: getModelToken('Model'), useValue: mockModel },
      ],
    }).compile();

    service = module.get<ModelsService>(ModelsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
