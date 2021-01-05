import { Test } from '@nestjs/testing';
import { MailClientService } from './mail-service-client.service';
import { BiosimulationsConfigModule } from '@biosimulations/config/nest'
describe('MailServiceClientService', () => {
  let service: MailClientService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [MailClientService],
      imports: [BiosimulationsConfigModule]
    }).compile();

    service = module.get(MailClientService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
