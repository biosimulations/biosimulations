import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { SimulationRunModel } from '../simulation-run/simulation-run.model';
import { ProjectModel } from './project.model';
import { ProjectsService } from './projects.service';
import { FilesService } from '../files/files.service';
import { SpecificationsService } from '../specifications/specifications.service';
import { SimulationHDFService } from '@biosimulations/hsds/client';
import {
  SimulationFile,
  SimulationFileSchema,
} from '../simulation-run/file.model';
import { FileModel } from '../files/files.model';
import { SpecificationsModel } from '../specifications/specifications.model';
import { SimulationRunLog, CombineArchiveLog } from '../logs/logs.model';
import {
  SimulationRunMetadataModel,
  SimulationRunMetadataSchema,
} from '../metadata/metadata.model';
import { SimulationRunService } from '../simulation-run/simulation-run.service';
import { ResultsService } from '../results/results.service';
import { LogsService } from '../logs/logs.service';
import { MetadataService } from '../metadata/metadata.service';
import { HttpModule } from '@nestjs/axios';
import { SharedNatsClientModule } from '@biosimulations/shared/nats-client';
import { BiosimulationsConfigModule } from '@biosimulations/config/nest';
import {
  SharedStorageModule,
  SharedStorageService,
  SimulationStorageService,
} from '@biosimulations/shared/storage';

describe('ProjectsService', () => {
  let service: ProjectsService;

  class mockModel {
    constructor(private data: any) {}
    static save = jest.fn().mockResolvedValue('test');
    save = mockModel.save;
    static find = jest.fn().mockResolvedValue({});
    static findOne = jest.fn().mockResolvedValue({});
    static findOneAndUpdate = jest.fn().mockResolvedValue({});
    static deleteOne = jest.fn().mockResolvedValue(true);
  }

  class mockFile {
    data: any;
    save: () => any;
    constructor(body: any) {
      this.data = body;
      this.save = () => {
        return this.data;
      };
    }
  }

  class mockStorage {
    putObject() {}
    getObject() {}
  }

  class mockSimService {
    getDataSets(id: string) {
      return;
    }
    getDataSetbyId(id: string) {}
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, SharedNatsClientModule, BiosimulationsConfigModule],
      providers: [
        { provide: getModelToken(ProjectModel.name), useValue: {} },
        {
          provide: getModelToken(SimulationFile.name),
          useClass: mockFile,
        },
        {
          provide: getModelToken(SimulationRunModel.name),
          useClass: mockFile,
        },
        { provide: getModelToken(FileModel.name), useValue: {} },
        { provide: getModelToken(SpecificationsModel.name), useValue: {} },
        {
          provide: getModelToken(SimulationRunLog.name),
          useValue: mockModel,
        },
        {
          provide: getModelToken(CombineArchiveLog.name),
          useValue: mockModel,
        },
        {
          provide: getModelToken(SimulationRunMetadataModel.name),
          useValue: {},
        },
        { provide: SharedStorageService, useClass: mockStorage },
        { provide: SimulationStorageService, useClass: mockStorage },
        {
          provide: SimulationHDFService,
          useClass: mockSimService,
        },
        ProjectsService,
        FilesService,
        SpecificationsService,
        SimulationRunService,
        ResultsService,
        LogsService,
        MetadataService,
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
