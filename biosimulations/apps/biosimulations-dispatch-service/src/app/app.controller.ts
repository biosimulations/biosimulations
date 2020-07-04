import { Controller, Get, Logger, Post, Body, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import { HpcService } from './services/hpc/hpc.service';
import { SbatchService } from './services/sbatch/sbatch.service';
import { OmexFile } from './types/omex-file/omex-file'
import { SimulationSpec } from './types/simulation-spec/simulation-spec'
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
  uploadFile(data: SimulationSpec) {
    this.logger.log('Data received: ' + JSON.stringify(data));
    // TODO: Replace with fileStorage URL from configModule (BiosimulationsConfig)
    const fileStorage = process.env.FILE_STORAGE;
    const sbatchStorage = `${fileStorage}/SBATCH/ID`;

    if (data.filename === '') {
      return {message: 'No filename was provided!'};
    }

    // const tempDir = fs.mkdtempSync('/tmp/dispatch-');
    // fs.accessSync(tempDir, fs.constants.W_OK);

    const omexPath = data.filepathOnDataStore;
    const sbatchName = `${uuid()}.sbatch`
    const sbatchPath = path.join(sbatchStorage, sbatchName)

    this.logger.log('SBatch path: ' + sbatchPath);
    
    // const hpcConfig = this.configService.get('hpc');

    // const sshConf = hpcConfig.ssh as SSHConnectionConfig;
    // const sftpConf = hpcConfig.sftp as SSHConnectionConfig;

    // fs.writeFileSync(omexPath, file.buffer);

    // Generate SBATCH script
    const hpcTempDirPath = `${this.configService.get('hpc').simDirBase}/${data.uniqueFilename.split('.')[0]}`;
    const sbatchString = this.sbatchService.generateSbatch(hpcTempDirPath, data.simulator, data.filename);
    fs.writeFileSync(sbatchPath, sbatchString);

    this.logger.log('HPC Temp basedir: ' + hpcTempDirPath);

    // const hpc = new Hpc(sshConf, sftpConf);
    this.hpcService.dispatchJob(hpcTempDirPath, sbatchPath, omexPath, data.filename);

    // TODO: Remove the directory when files are copied to HPC
    // this.removeNonEmptyDir(tempDir);
    return { message: 'Simulation dispatch started.'};

  }

  // removeNonEmptyDir(path: string) {
  //   if (fs.existsSync(path)) {
  //     const files = fs.readdirSync(path)
   
  //     if (files.length > 0) {
  //       files.forEach(filename => {
  //         if (fs.statSync(path + '/' + filename).isDirectory()) {
  //           this.removeNonEmptyDir(path + '/' + filename)
  //         } else {
  //           fs.unlinkSync(path + '/' + filename)
  //         }
  //       })
  //       fs.rmdirSync(path)
  //     } else {
  //       fs.rmdirSync(path)
  //     }
  //   } else {
  //     this.logger.log('Directory path not found.')
  //   }
  // }
  
}
