/**
 * @file Contains tests for the simulation run service
 * @author Bilal Shaikh
 * @copyright Biosimulations Team, 2020
 * @license MIT
 */
import { BiosimulationsConfigModule } from '@biosimulations/config/nest';
import { SharedNatsClientModule } from '@biosimulations/shared/nats-client';
import {
  SharedStorageModule,
  SharedStorageService,
  SimulationStorageService,
} from '@biosimulations/shared/storage';
import { HttpModule } from '@nestjs/axios';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { SimulationFile } from './file.model';
import { SimulationRunModel } from './simulation-run.model';
import { SimulationRunService } from './simulation-run.service';

import { FilesService } from '../files/files.service';
import { FileModel } from '../files/files.model';
import { SpecificationsService } from '../specifications/specifications.service';
import { SpecificationsModel } from '../specifications/specifications.model';
import { ResultsService } from '../results/results.service';
import { SimulationHDFService } from '@biosimulations/hsds/client';
import { LogsService } from '../logs/logs.service';
import { SimulationRunLog, CombineArchiveLog } from '../logs/logs.model';
import { MetadataService } from '../metadata/metadata.service';
import {
  SimulationRunMetadataModel,
  SimulationRunMetadataSchema,
} from '../metadata/metadata.model';

import { OntologiesService } from '@biosimulations/ontology/ontologies';

describe('SimulationRunService', () => {
  let service: SimulationRunService;

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

  class mockModel {
    constructor(private data: any) {}
    static save = jest.fn().mockResolvedValue('test');
    save = mockModel.save;
    static find = jest.fn().mockResolvedValue({});
    static findOne = jest.fn().mockResolvedValue({});
    static findOneAndUpdate = jest.fn().mockResolvedValue({});
    static deleteOne = jest.fn().mockResolvedValue(true);
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
        SimulationRunService,
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
        FilesService,
        SpecificationsService,
        ResultsService,
        LogsService,
        MetadataService,
        OntologiesService,
      ],
    }).compile();

    service = module.get<SimulationRunService>(SimulationRunService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
