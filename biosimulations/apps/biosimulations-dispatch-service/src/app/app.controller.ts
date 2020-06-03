import { Controller, Get, Logger, Post, Body, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Hpc } from './utils/hpc/hpc'
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { throws } from 'assert';
import { SSHConnectionConfig } from './utils/ssh/ssh';
import * as fs from 'fs';

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
  uploadFile(@UploadedFiles() files: Array<any>, @Body() body) {
    console.log(files);
    console.log(body);

    const omexPath = '';
    const sbatchPath = '';

    // Get tempDir synchronously
    const tempDir = this.makeTempDir;

    console.log('Tempdir:', tempDir);
    
    const hpcConfig = this.configService.get('hpc');

    const sshConf = hpcConfig.ssh as SSHConnectionConfig;
    const sftpConf = hpcConfig.sftp as SSHConnectionConfig;

    
    
    files.forEach( item => {
      fs.writeFileSync(`${tempDir}/${item.originalname}`, item.buffer);
    });



    const hpc = new Hpc(sshConf, sftpConf);
    hpc.dispatchJob(body, omexPath, sbatchPath)

    // Add code to delete tempDir

  }

  async makeTempDir(prefix: string) {
    let tempDir = '';
    await fs.mkdtemp('/tmp/dispatch.', (err, folder) => {
      if (err) {
        console.log('Error while creating temp dir: ', err);
      } else {
        console.log('Temp dir created: ', folder);
        tempDir = folder;
      }
    });
    return tempDir;
  }
  
}
