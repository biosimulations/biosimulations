import { 
  Controller, 
  Inject, 
  OnApplicationBootstrap, 
  Post, UseInterceptors, 
  UploadedFile, 
  Body, 
  HttpException, 
  HttpStatus, 
  Logger, 
  Get, 
  Param
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';
import { ApiOperation, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { SimulationDispatchSpec, OmexDispatchFile } from '@biosimulations/datamodel/core';
import { v4 as uuid } from 'uuid';
import * as fs from 'fs';
import path from 'path';
import * as csv2Json from 'csv2json';


interface Dic {
  [key: string]: {
    [key: string]: Object[]
  }
}


@Controller()
export class AppController implements OnApplicationBootstrap {
  private logger = new Logger(AppController.name);
  constructor(
    private readonly appService: AppService,
    @Inject('DISPATCH_MQ') private messageClient: ClientProxy,
    ) {}

    @Post('dispatch')
    @ApiConsumes('multipart/form-data')
    @ApiOperation({summary: 'Dispatch a simulation job'})
    @ApiResponse({
      status: 201,
      description: 'Dispatch status',
      type: Object
    })
    // TODO: Create a custom decorator for this and move to shared libs
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            description: 'Omex file to upload',
            format: 'binary',
          },
          simulator: {
            type: 'string',
            description: 'Simulator to use like COPASI/VCELL, etc'
          }
        },
      },
    })
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(@UploadedFile() file: OmexDispatchFile, @Body() bodyData: SimulationDispatchSpec) {
    // TODO: Replace with fileStorage URL from configModule (BiosimulationsConfig)
    // TODO: Create the required folders automatically
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
    this.logger.log('Dispatch message was sent successfully' + JSON.stringify(simSpec));
    
    return {
      message: 'File uploaded successfuly',
      data: {
        filename: uniqueFilename
      }
    }
  }

  @Get('result/:uuid')
  @ApiResponse({
    status: 200,
    description: 'Get Simulation Results',
    type: Object
  })
  getVisualizationData(@Param('uuid') uId: string) {
    const jsonResults: Dic = {};
    const fileStorage = process.env.FILE_STORAGE||'';
    
    const csvFilePath = path.join(fileStorage, 'RESULTS', 'ID', uId );

    const directoryList = fs.readdirSync(csvFilePath);

    directoryList.forEach((directoryName: string) => {
      const fileList = fs.readdirSync(path.join(csvFilePath, directoryName));

      fileList.forEach(async (filename: string) => {
        if (filename.endsWith('csv')) {
          const taskName = filename.split('.csv')[0];
          const filePath = path.join(csvFilePath, directoryName, filename);
          this.logger.log('Reading file: ' + filePath);
          
          if (jsonResults[directoryName] === undefined) {
            jsonResults[directoryName] = {};
          }

          const jsonPath = filePath.split('.csv')[0] + '.json';

          const jsonResult:Object[] = [];
          setTimeout(() => {
            fs.createReadStream(filePath).pipe(
              csv2Json.default({
                separator: ','
              })
            ).pipe(fs.createWriteStream(jsonPath));
          }, 0);

          const fileContent = fs.readFileSync(jsonPath)
          jsonResults[directoryName][taskName] = JSON.parse(fileContent.toString());
        }
      });

    });
    return {
      message: 'Data fetched successfully',
      data: jsonResults
    };
    
  }
  
  async onApplicationBootstrap() {
    await this.messageClient.connect();
  }
}
