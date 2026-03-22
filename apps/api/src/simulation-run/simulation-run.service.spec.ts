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
import { SimulationRunService } from './simulation-run.service';

import { FilesService } from '../files/files.service';
import { SpecificationsService } from '../specifications/specifications.service';
import { ResultsService } from '../results/results.service';
import { SimulationHDFService } from '@biosimulations/simdata-api/nest-client-wrapper';
import { LogsService } from '../logs/logs.service';

import { MetadataService } from '../metadata/metadata.service';

import { OntologyApiService } from '@biosimulations/ontology/api';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ProjectsService } from '../projects/projects.service';
import { Model } from 'mongoose';
import { beforeEach, it, describe, expect, jest } from '@jest/globals';

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

describe('SimulationRunService', () => {
  let service: SimulationRunService;
  let projectsService: ProjectsService;
  let simulationRunModel: Model<SimulationRunModel>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, SharedNatsClientModule, BiosimulationsConfigModule, CacheModule.register()],
      providers: [
        SimulationRunService,
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

    service = module.get<SimulationRunService>(SimulationRunService);
    projectsService = module.get<ProjectsService>(ProjectsService);
    simulationRunModel = module.get<Model<SimulationRunModel>>(getModelToken(SimulationRunModel.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('deleting simulation run should check for published projects', async () => {
    let mock = jest.spyOn(projectsService, 'getProjectIdBySimulationRunId').mockResolvedValue('projectId');

    await expect(service.delete('simulationRunId')).rejects.toThrow(BadRequestException);
    expect(mock).toHaveBeenCalled();
  });

  it('deleting all simulation runs should check for existing projects', async () => {
    let mock = jest.spyOn(projectsService, 'getCount').mockResolvedValue(1);

    await expect(service.deleteAll()).rejects.toThrow(BadRequestException);
    expect(mock).toHaveBeenCalled();

    mock = jest.spyOn(projectsService, 'getCount').mockResolvedValue(0);

    // expect a type error bc we have not yet mocked the find function fully
    await expect(service.deleteAll()).rejects.toThrow(TypeError);
    expect(mock).toHaveBeenCalled();
  });
  it('deleting a non-existing simulation run should throw error', async () => {
    const mock = jest.spyOn(projectsService, 'getProjectIdBySimulationRunId').mockResolvedValue(undefined);

    let dbMock = jest.spyOn(simulationRunModel, 'findOneAndDelete').mockResolvedValue(null);
    await expect(service.delete('simulationRunId')).rejects.toThrow(NotFoundException);
    expect(dbMock).toHaveBeenCalled();
  });
});
