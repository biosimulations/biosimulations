import { Controller, Inject, OnApplicationBootstrap, Post, UseInterceptors, UploadedFile, Body, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';
import { ApiProperty, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SimulationDispatchSpec, OmexDispatchFile } from '@biosimulations/datamodel/core';
import { v4 as uuid } from 'uuid';
import * as fs from 'fs';
import path from 'path';
import { IsString } from 'class-validator';

export class SimulationDispatchSpecDTO {
  @ApiProperty({example: 'COPASI', description: 'Name of the simulator', type: String})
  @IsString()
  simulator!: string;
}

// @ApiTags()
@Controller()
export class AppController implements OnApplicationBootstrap {
  private logger = new Logger(AppController.name);
  constructor(
    private readonly appService: AppService,
    @Inject('DISPATCH_MQ') private messageClient: ClientProxy,
    ) {}

    @Post('dispatch')
    @ApiOperation({summary: 'Dispatch a simulation job'})
    @ApiResponse({
      status: 200,
      description: 'Dispatch status',
      type: Object
    })
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(@UploadedFile() file: OmexDispatchFile, @Body() bodyData: SimulationDispatchSpecDTO) {
    // TODO: Replace with fileStorage URL from configModule (BiosimulationsConfig)
    const fileStorage = process.env.FILE_STORAGE;
    const omexStorage = `${fileStorage}/OMEX/ID`;

    

    if (bodyData.simulator === '') {
      return {message: 'No Simulator was provided'};
    }

    // Get existing filetype
    // Generate a unique filename
    const uniqueFilename = `${uuid()}.omex`;
    const omexSavePath = path.join(omexStorage, uniqueFilename);
    

    // Fill out info from file that will be lost after saving in central storage
    const simSpec: SimulationDispatchSpec = {
      simulator: bodyData.simulator,
      filename: file.originalname,
      uniqueFilename,
      filepathOnDataStore: omexSavePath
    };

    // Save the file
    fs.writeFileSync(omexSavePath, file.buffer);

    this.messageClient.send('dispatch', simSpec).subscribe(
      res => {
        this.logger.log(JSON.stringify(res));
      },
      err => {
        this.logger.log('Error occured in dispatch service: ' + JSON.stringify(err));
      }
    );
    
    return {
      message: 'File uploaded successfuly',
      data: {
        filename: uniqueFilename
      }
    }
  }

  async onApplicationBootstrap() {
    await this.messageClient.connect();
  }
}
