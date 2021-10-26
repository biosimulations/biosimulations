import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { SimulationRunModel } from '../simulation-run/simulation-run.model';
import { ProjectModel } from './project.model';
import { ProjectsService } from './projects.service';
import { SimulationFile, SimulationFileSchema } from '../simulation-run/file.model';
import { SimulationRunMetadataModel, SimulationRunMetadataSchema } from '../metadata/metadata.model';
import { SimulationRunService } from '../simulation-run/simulation-run.service';
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
        { provide: getModelToken(SimulationRunMetadataModel.name), useValue: {} },
        { provide: SharedStorageService, useClass: mockStorage },
        { provide: SimulationStorageService, useClass: mockStorage },
        ProjectsService,
        SimulationRunService,
        MetadataService,
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
