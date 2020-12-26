import { Test } from '@nestjs/testing';
import { MailServiceClientService } from './mail-service-client.service';

describe('MailServiceClientService', () => {
  let service: MailServiceClientService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [MailServiceClientService],
    }).compile();

    service = module.get(MailServiceClientService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
