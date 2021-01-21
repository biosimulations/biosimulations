import { Test, TestingModule } from '@nestjs/testing';
import { LogsController } from './logs.controller';
import { LogsService } from './logs.service';

describe('LogsController', () => {
  let controller: LogsController;
  const mockService = {
    getLog(id: string) {
      return {
        message: `Sample log for ${id}`,
        output: null
      };
    },
    getOldLogs(id: string) {
      return {
        output: 'oldOut',
        error: 'oldErr'
      };
    }
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LogsController],
      providers: [{ provide: LogsService, useValue: mockService }]
    }).compile();

    controller = module.get<LogsController>(LogsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it(' should get logs from service', async () => {
    const log = await controller.getLogs('testId');
    //@ts-ignore
    expect(log.message).toBe('Sample log for testId');
  });

  it(' should get older logs from service', async () => {
    const log = await controller.getLogs('testId');
    //@ts-ignore
    expect(log.output).toBe('oldOutoldErr');
  });
});
