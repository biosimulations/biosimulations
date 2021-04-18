import { SimulationRunReportDataStrings } from '@biosimulations/dispatch/api-models';
import { SimulationRunService } from '@biosimulations/dispatch/nest-client';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { ArchiverService } from './archiver.service';

import { FileService } from './file.service';

import { ResultsService } from './results.service';
class MockSimulationsRunService {
  async sendReport() {}
}
class mockArchiverService {
  async createResultArchive() {}
}
class MockFileService {
  async getResultdirectory() {}
}
class MockClient {
  emit() {}
}
describe('ResultsService', () => {
  let service: ResultsService;
  let expected: SimulationRunReportDataStrings;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResultsService,
        ConfigService,
        { provide: 'NATS_CLIENT', useClass: MockClient },
        { provide: SimulationRunService, useClass: MockSimulationsRunService },
        { provide: ArchiverService, useClass: mockArchiverService },
        { provide: FileService, useClass: MockFileService },
      ],
    }).compile();

    service = module.get<ResultsService>(ResultsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should parse column oriented csv', async () => {
    //@ts-ignore
    const parsed = await service.readCSV(
      'fixtures/dispatch-service/column-headers.csv',
    );
    expected = {
      'Header, 1': ['1', '3', '5', '7', '9', '11'],
      'header 2': ['2', '4', '6', '8'],
    };
    expect(parsed).toStrictEqual(expected);
  });

  it('should parse row oriented csv', async () => {
    const file = {
      name: 'test',
      path: 'fixtures/dispatch-service/row-headers.csv',
    };
    //@ts-ignore
    const parsed = await service.parseToJson(file);

    expected = {
      'Header, 1': ['1', '3', '5', '7', '9', '11'],
      'header 2': ['2', '4', '6', '8', '', ''],
    };

    expect(parsed).toStrictEqual(expected);
  });
});
