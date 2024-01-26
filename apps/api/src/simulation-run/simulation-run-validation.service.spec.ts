/**
 * @file Contains tests for the simulation run service
 * @author Bilal Shaikh
 * @copyright BioSimulations Team, 2020
 * @license MIT
 */
import { BiosimulationsConfigModule } from '@biosimulations/config/nest';
import { SharedNatsClientModule } from '@biosimulations/shared/nats-client';
import { SimulationStorageService } from '@biosimulations/shared/storage';
import { HttpModule } from '@nestjs/axios';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { SimulationRunModel } from './simulation-run.model';
import { SimulationRunValidationService } from './simulation-run-validation.service';

import { FilesService } from '../files/files.service';
import { SpecificationsService } from '../specifications/specifications.service';
import { ResultsService } from '../results/results.service';
import { SimulationHDFService } from '@biosimulations/simdata-api/nest-client-wrapper';
import { LogsService } from '../logs/logs.service';

import { MetadataService } from '../metadata/metadata.service';

import { OntologyApiService } from '@biosimulations/ontology/api';
import { BadRequestException, CacheModule, NotFoundException } from '@nestjs/common';
import { ProjectsService } from '../projects/projects.service';
import { Model } from 'mongoose';
import { beforeEach, it, describe, expect } from '@jest/globals';

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

class mockProjectsService {
  getProjectIdBySimulationRunId(id: string) {
    return 'projectId';
  }
  getCount() {
    return 1;
  }
}

class mockSimulationRunModel {
  findOneAndDelete(model: any) {
    return;
  }
}

describe('SimulationRunValidationService', () => {
  let service: SimulationRunValidationService;
  let projectsService: ProjectsService;
  let simulationRunModel: Model<SimulationRunModel>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, SharedNatsClientModule, BiosimulationsConfigModule, CacheModule.register()],
      providers: [
        SimulationRunValidationService,
        {
          provide: getModelToken(SimulationRunModel.name),
          useClass: mockSimulationRunModel,
        },
        { provide: ProjectsService, useClass: mockProjectsService },
        { provide: SimulationStorageService, useClass: mockStorage },
        {
          provide: SimulationHDFService,
          useClass: mockSimService,
        },
        { provide: FilesService, useValue: {} },
        { provide: SpecificationsService, useValue: {} },
        { provide: ResultsService, useValue: {} },
        { provide: MetadataService, useValue: {} },
        { provide: LogsService, useValue: {} },
        { provide: OntologyApiService, useValue: {} },
      ],
    }).compile();

    service = module.get<SimulationRunValidationService>(SimulationRunValidationService);
    projectsService = module.get<ProjectsService>(ProjectsService);
    simulationRunModel = module.get<Model<SimulationRunModel>>(getModelToken(SimulationRunModel.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
