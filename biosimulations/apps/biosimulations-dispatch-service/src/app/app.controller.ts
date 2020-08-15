import { Controller, Get, Logger, Post, Body, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import { HpcService } from './services/hpc/hpc.service';
import { SbatchService } from './services/sbatch/sbatch.service';
import { SimulationDispatchSpec } from '@biosimulations/datamodel/core';
import { v4 as uuid } from 'uuid';
import path from 'path';

@Controller()
export class AppController {
  constructor( 
    private readonly configService: ConfigService,
    private hpcService: HpcService,
    private sbatchService: SbatchService
    ) {}
  private logger = new Logger(AppController.name);
  
  @MessagePattern('dispatch')
  uploadFile(data: SimulationDispatchSpec) {
    this.logger.log('Data received: ' + JSON.stringify(data));
    // TODO: Replace with fileStorage URL from configModule (BiosimulationsConfig)
    const fileStorage = process.env.FILE_STORAGE;
    const sbatchStorage = `${fileStorage}/SBATCH/ID`;

    if (
      (data.simulator !== 'COPASI') && 
      (data.simulator !== 'VCell') && 
      (data.simulator !== 'Tellurium') &&
      (data.simulator !== 'CopraPy') &&
      (data.simulator !== 'BioNetGen')) {
      return {message: 'Unsupported simulator was provided!'};
    }

    const omexPath = data.filepathOnDataStore;
    const sbatchName = `${uuid()}.sbatch`
    const sbatchPath = path.join(sbatchStorage, sbatchName)

    this.logger.log('SBatch path: ' + sbatchPath);
    
    // Generate SBATCH script
    const simulatorString = `biosimulations_${data.simulator.toLowerCase()}_${data.simulatorVersion}`;
    const hpcTempDirPath = `${this.configService.get('hpc').simDirBase}/${data.uniqueFilename.split('.')[0]}`;
    const sbatchString = this.sbatchService.generateSbatch(hpcTempDirPath, simulatorString, data.filename);
    fs.writeFileSync(sbatchPath, sbatchString);

    this.logger.log('HPC Temp basedir: ' + hpcTempDirPath);

    this.hpcService.dispatchJob(hpcTempDirPath, sbatchPath, omexPath, data.filename);

    return { message: 'Simulation dispatch started.'};

  }

  
}
