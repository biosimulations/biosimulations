import { Controller, Get, Logger, Post, Body, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Hpc } from './utils/hpc/hpc'
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { throws } from 'assert';
import { SSHConnectionConfig } from './utils/ssh/ssh';
import * as fs from 'file-system';
import { Sbatch } from './utils/sbatch/sbatch';

@Controller()
export class AppController {
  constructor( private readonly configService: ConfigService) {}
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
    console.log(file);
    console.log(body);

    const tempDir = fs.mkdtempSync('/tmp/dispatch-');
    fs.accessSync(tempDir, fs.constants.W_OK);

    const omexPath = `${tempDir}/${file.originalname}`;
    const sbatchPath = `${tempDir}/run.sbatch`;

    console.log('Tempdir:', tempDir);
    
    const hpcConfig = this.configService.get('hpc');

    const sshConf = hpcConfig.ssh as SSHConnectionConfig;
    const sftpConf = hpcConfig.sftp as SSHConnectionConfig;

    fs.writeFileSync(omexPath, file.buffer);

    // Generate SBATCH script
    const hpcTempDirPath = `${this.configService.get('hpcSimDirBase')}/${tempDir.split('-')[1]}`;
    const sbatchString = Sbatch.generate(hpcTempDirPath, body.simulator);
    fs.writeFileSync(sbatchPath, sbatchString);

    const hpc = new Hpc(sshConf, sftpConf);
    hpc.dispatchJob(hpcTempDirPath, omexPath, sbatchPath)

    // this.removeNonEmptyDir(tempDir);

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
      console.log('Directory path not found.')
    }
  }
  
}
