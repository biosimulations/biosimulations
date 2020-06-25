import { Controller, Get, Logger, Post, Body, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import { HpcService } from './services/hpc/hpc.service';
import { SbatchService } from './services/sbatch/sbatch.service';

@Controller()
export class AppController {
  constructor( 
    private readonly configService: ConfigService,
    private hpcService: HpcService,
    private sbatchService: SbatchService
    ) {}
  private logger = new Logger(AppController.name);
  
  @MessagePattern('dispatch')
  // @Post('/dispatch')
  dispatch() {
  // dispatch(@Body() simSpec: object) {
    this.logger.log('dispatching job');
    // Get sim spec from message/request
    // const hpc = new Hpc(this.configService.get())
    // Call HPC manager
    // Log at each step
  }

  @Post('dispatch')
  @UseInterceptors(FileInterceptor('file'))
  // Make multiple files work
  uploadFile(@UploadedFile() file, @Body() body) {
    this.logger.log(file);
    this.logger.log(body);

    if (file === null) {
      return {message: 'No file provided!'};
    }

    const tempDir = fs.mkdtempSync('/tmp/dispatch-');
    fs.accessSync(tempDir, fs.constants.W_OK);

    const omexPath = `${tempDir}/${file.originalname}`;
    const sbatchPath = `${tempDir}/run.sbatch`;

    this.logger.log('Tempdir:', tempDir);
    
    // const hpcConfig = this.configService.get('hpc');

    // const sshConf = hpcConfig.ssh as SSHConnectionConfig;
    // const sftpConf = hpcConfig.sftp as SSHConnectionConfig;

    fs.writeFileSync(omexPath, file.buffer);

    // Generate SBATCH script
    const hpcTempDirPath = `${this.configService.get('hpc').hpcSimDirBase}/${tempDir.split('-')[1]}`;
    const sbatchString = this.sbatchService.generateSbatch(hpcTempDirPath, body.simulator, file.originalname);
    fs.writeFileSync(sbatchPath, sbatchString);

    // const hpc = new Hpc(sshConf, sftpConf);
    this.hpcService.dispatchJob(hpcTempDirPath, omexPath, sbatchPath)

    // TODO: Remove the directory when files are copied to HPC
    // this.removeNonEmptyDir(tempDir);
    return { message: 'Simulation dispatch started.'};

  }

  removeNonEmptyDir(path) {
    if (fs.existsSync(path)) {
      const files = fs.readdirSync(path)
   
      if (files.length > 0) {
        files.forEach(filename => {
          if (fs.statSync(path + '/' + filename).isDirectory()) {
            this.removeNonEmptyDir(path + '/' + filename)
          } else {
            fs.unlinkSync(path + '/' + filename)
          }
        })
        fs.rmdirSync(path)
      } else {
        fs.rmdirSync(path)
      }
    } else {
      this.logger.log('Directory path not found.')
    }
  }
  
}
