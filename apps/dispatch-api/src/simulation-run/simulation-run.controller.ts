/* eslint-disable @typescript-eslint/member-ordering */
/**
 * @file Contains the controller for CRUD operations on simulation runs
 * @author Bilal Shaikh
 * @copyright Biosimulations Team 2020
 * @license MIT
 */
import { DispatchJob } from '@biosimulations/messages/messages';
import { OptionalAuth, permissions } from '@biosimulations/auth/nest';
import { ErrorResponseDocument } from '@biosimulations/datamodel/api';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiPayloadTooLargeResponse,
  ApiTags,
  ApiUnsupportedMediaTypeResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { Response, Request } from 'express';
import {
  SimulationRun,
  SimulationUpload,
  UpdateSimulationRun,
  UploadSimulationRun,
  UploadSimulationRunUrl,
} from '@biosimulations/dispatch/api-models';
import { SimulationRunService } from './simulation-run.service';
import { SimulationRunModelReturnType } from './simulation-run.model';
import { AuthToken } from '@biosimulations/auth/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

type multipartSimulationRunBody = { simulationRun: string };
// 1gb in bytes plus a buffer to be used as file size limits
const ONE_GIGABYTE = 1100000000;
@ApiTags('Simulation runs')
@Controller(['runs', 'run'])
@ApiExtraModels(UploadSimulationRun, UploadSimulationRunUrl, SimulationUpload)
export class SimulationRunController {
  private TIMEOUT_INTERVAL = 10000;
  private RETRY_COUNT = 2;
  private logger: Logger;

  public constructor(
    private service: SimulationRunService,
    @InjectQueue('dispatch') private readonly dispatchQueue: Queue<DispatchJob>,
  ) {
    this.logger = new Logger(SimulationRunController.name);
  }

  private isFileUploadBody(
    body: multipartSimulationRunBody | UploadSimulationRunUrl,
  ): body is multipartSimulationRunBody {
    return (<multipartSimulationRunBody>body).simulationRun != undefined;
  }
  private isUrlBody(
    body: multipartSimulationRunBody | UploadSimulationRunUrl,
  ): body is UploadSimulationRunUrl {
    return (<UploadSimulationRunUrl>body).url != undefined;
  }

  @ApiOperation({
    summary: 'Get all of the simulation runs',
    description:
      'Returns an array of all the simulation run objects in the database',
  })
  @ApiOkResponse({ description: 'OK', type: [SimulationRun] })
  @permissions('read:SimulationRuns')
  @Get()
  public async getRuns(): Promise<SimulationRun[]> {
    const res = await this.service.getAll();
    return res.map(this.makeSimulationRun);
  }

  @ApiOperation({
    summary: 'Submit a simulation to run',
    description:
      'Upload an COMBINE/OMEX archive file along with a description of the simulator to use to execute the archive.\
       The simulation will be excecuted and the status of the simulation run object will be updated. \
      \nThe simulation can be uploaded as a COMBINE archive by using the multipart/form-data accept header.\
      Alternatively, use the application/json accept header to provide a URL to an external COMBINE archive',
    requestBody: {
      content: {
        'application/json': {
          encoding: { body: { contentType: 'application/json' } },
          schema: { $ref: getSchemaPath(UploadSimulationRunUrl) },
        },
        'multipart/form-data': {
          encoding: { body: { contentType: 'multipart/form-data' } },
          schema: { $ref: getSchemaPath(SimulationUpload) },
        },
      },
    },
  })
  @ApiCreatedResponse({
    type: SimulationRun,
    description: 'Simulation run submitted',
  })
  @ApiPayloadTooLargeResponse({
    type: ErrorResponseDocument,
    description:
      'COMBINE/OMEX file is too large. Files must be less than 1 GB.',
  })
  @ApiBadRequestResponse({
    type: ErrorResponseDocument,
    description: 'Request did not adhere to schema',
  })
  @ApiUnsupportedMediaTypeResponse({
    type: ErrorResponseDocument,
    description:
      'The mediatype is unsupported. Mediatype must be application/json or multipart/form-data',
  })

  // Set a file size limit of 1GB
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: ONE_GIGABYTE } }),
  )
  @Post()
  public async createRun(
    @Body() body: multipartSimulationRunBody | UploadSimulationRunUrl,
    @UploadedFile() file: any,
    @Req() req: Request,
  ): Promise<SimulationRun> {
    const contentType = req.header('Content-Type');
    let run: SimulationRunModelReturnType;

    if (!contentType) {
      throw new UnsupportedMediaTypeException(' Must specifiy a Content-Type');
    } else if (contentType?.startsWith('multipart/form-data')) {
      run = await this.createRunWithFile(body, file);
    } else if (
      contentType?.startsWith('application/json') &&
      this.isUrlBody(body)
    ) {
      run = await this.service.createRunWithURL(body);
    } else {
      throw new UnsupportedMediaTypeException(
        'Can only accept application/json or multipart/form-data content',
      );
    }
    const response = this.makeSimulationRun(run);

    const message: DispatchJob = {
      simId: run.id,
      fileName: file?.originalname || 'input.omex',
      simulator: run.simulator,
      version: run.simulatorVersion,
      cpus: run.cpus,
      memory: run.memory,
      maxTime: run.maxTime,
      envVars: run.envVars,
    };
    const sim = await this.dispatchQueue.add(message);

    return response;
  }

  private async createRunWithFile(
    body: multipartSimulationRunBody | UploadSimulationRunUrl,
    file: any,
  ): Promise<SimulationRunModelReturnType> {
    let parsedRun: UploadSimulationRun;

    try {
      if (this.isFileUploadBody(body)) {
        // We are making an unsafe assertion here, since the body could have any type.
        // This should be caught by the database validation however
        parsedRun = JSON.parse(body.simulationRun) as UploadSimulationRun;
      } else {
        throw new Error('Body is invalid');
      }
    } catch (e) {
      throw new BadRequestException(
        'The provided input was not valid: ' + e.message,
      );
    }

    const run = this.service.createRunWithFile(parsedRun, file);
    return run;
  }
  /**
   *  Creates the controllers return type SimulationRun
   * @param run The value that is returned from the service.
   */
  public makeSimulationRun(run: SimulationRunModelReturnType): SimulationRun {
    return new SimulationRun(
      run.id,
      run.name,
      run.simulator,
      run.simulatorVersion,
      run.cpus,
      run.memory,
      run.maxTime,
      run.envVars,
      run.submitted,
      run.updated,
      run.public,
      run.status,
      run.runtime,
      run.projectSize,
      run.resultsSize,
      run.email,
    );
  }

  @ApiOperation({
    summary: 'Get a simulation run',
    description: 'Get information about a simulation run',
  })
  @ApiOkResponse({ type: SimulationRun })
  @Get(':id')
  @OptionalAuth()
  public async getRun(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<SimulationRun> {
    const user = req?.user as AuthToken;
    let permission = false;
    if (user) {
      user.permissions = user.permissions || [];
      permission = user.permissions.includes('read:Email');
    }
    const run = await this.service.get(id);
    if (run) {
      permission ? null : (run.email = null);
      return this.makeSimulationRun(run);
    } else {
      throw new NotFoundException(`No simulation run with id ${id}`);
    }
  }

  @ApiOperation({
    summary: 'Modify a simulation run',
    description: 'Change the status or information of a simulation run',
  })
  @permissions('write:SimulationRuns')
  @Patch(':id')
  public async modfiyRun(
    @Param('id') id: string,
    @Body() body: UpdateSimulationRun,
  ): Promise<SimulationRun> {
    this.logger.log(`Patch called for ${id} with ${JSON.stringify(body)}`);
    const run = await this.service.update(id, body);
    return this.makeSimulationRun(run);
  }

  @ApiOperation({
    summary: 'Delete a simulation run',
    description: 'Delete a simulation run',
  })
  @permissions('delete:SimulationRuns')
  @Delete(':id')
  public async deleteRun(
    @Param('id') id: string,
  ): Promise<SimulationRun | null> {
    const res = await this.service.delete(id);

    if (!res) {
      throw new NotFoundException(`No simulation run with id ${id} found`);
    }

    return this.makeSimulationRun(res);
  }

  @ApiOperation({
    summary: 'Delete all simulation runs',
    description: 'Delete all simulation runs',
  })
  @permissions('delete:SimulationRuns')
  @Delete()
  public deleteAll(): Promise<void> {
    return this.service.deleteAll();
  }

  @ApiOperation({
    description:
      'Download the COMBINE/OMEX archive file for the simulation run',
  })
  @Get(':id/download')
  @ApiTags('Downloads')
  public async download(
    @Param('id') id: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    const file = await this.service.download(id);
    if (file.mimetype) {
      response.setHeader('Content-Type', file.mimetype);
    }
    if (file.originalname) {
      const contentDisposition = `attachment; filename=${file.originalname}`;
      response.setHeader('Content-Disposition', contentDisposition);
    }
    if (file.size) {
      response.setHeader('Content-Size', file.size);
    }
    if (file.url) {
      response.redirect(file.url);
    } else {
      // Should never happen since url is a required property of the file model now
      throw new NotFoundException('Unable to locate the file');
    }
  }
}
