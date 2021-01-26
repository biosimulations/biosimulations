import { Test, TestingModule } from '@nestjs/testing';
import { LogsController } from './logs.controller';
import { LogsService } from './logs.service';
import { of } from 'rxjs';
describe('LogsController', () => {
  let controller: LogsController;
  let mockService: any;
  beforeEach(async () => {
    mockService = {
      getLog(id: string) {
        return '';
      },
      createLog(id: string, data: any) {
        return { simId: id, log: data };
      },
      getOldLogs(id: string): Promise<{ output: string; error: string }> {
        return of({
          output: 'oldOut',
          error: 'oldErr',
        }).toPromise();
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [LogsController],
      providers: [{ provide: LogsService, useValue: mockService }],
    }).compile();

    controller = module.get<LogsController>(LogsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it(' should get logs from service', async () => {
    const getSpy = jest.spyOn(mockService, 'getLog').mockReturnValue('test');

    const log = await controller.getLogs('testId');
    expect(getSpy).toHaveBeenCalled();
    //@ts-ignore
    expect(log).toBe('test');
  });

  it('Should get older logs on failure', async () => {
    const getSpy = jest.spyOn(mockService, 'getLog').mockReturnValue(null);
    const getOldSpy = jest
      .spyOn(mockService, 'getOldLogs')

      .mockReturnValue(of({ output: 'Old ', error: 'Logs' }).toPromise());
    const log = await controller.getLogs('testId');
    expect(getSpy).toHaveBeenCalled();
    expect(getOldSpy).toHaveBeenCalled();

    //@ts-ignore
    expect(log.output).toBe('Old Logs');
  });

  it('Should get create new log in database on failure', async () => {
    const getSpy = jest.spyOn(mockService, 'getLog').mockReturnValue(null);
    const getOldSpy = jest
      .spyOn(mockService, 'getOldLogs')
      .mockReturnValue(of({ output: 'Old ', error: 'Logs' }).toPromise());

    const getCreateSpy = jest.spyOn(mockService, 'createLog');
    const log = await controller.getLogs('testId');
    expect(getSpy).toHaveBeenCalled();
    expect(getCreateSpy).toHaveBeenCalled();

    //@ts-ignore
    expect(log.output).toBe('Old Logs');
  });

  it('Should handle failure to read old logs', async () => {
    const getSpy = jest.spyOn(mockService, 'getLog').mockReturnValue(null);
    const getOldSpy = jest
      .spyOn(mockService, 'getOldLogs')
      .mockImplementation(() => {
        throw new Error();
      });

    const getCreateSpy = jest.spyOn(mockService, 'createLog');
    const log = await controller.getLogs('testId');
    expect(getSpy).toHaveBeenCalled();
    expect(getCreateSpy).toHaveBeenCalled();

    //@ts-ignore
    expect(log.exception).toBeTruthy();
  });

  it('Should not get older logs on success', async () => {
    //@ts-ignore

    const getSpy = jest
      .spyOn(mockService, 'getLog')
      .mockReturnValue('valid value');
    const getOldSpy = jest
      .spyOn(mockService, 'getOldLogs')
      .mockReturnValue(of({ output: 'Old ', error: 'Logs' }).toPromise());
    const log = await controller.getLogs('testId');
    expect(getSpy).toHaveBeenCalled();
    expect(getOldSpy).not.toHaveBeenCalled();
    //@ts-ignore
    expect(log).toBe('valid value');
  });
});
