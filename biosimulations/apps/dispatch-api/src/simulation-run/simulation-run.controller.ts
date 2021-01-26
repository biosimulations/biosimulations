/**
 * @file Contains the controller for CRUD operations on simulation runs
 * @author Bilal Shaikh
 * @copyright Biosimulations Team 2020
 * @license MIT
 */
import {
  createdResponse,
  DispatchCreatedPayload,
  DispatchMessage,
} from '@biosimulations/messages/messages';
import { OptionalAuth, permissions } from '@biosimulations/auth/nest';
import { ClientProxy } from '@nestjs/microservices';
import { ErrorResponseDocument } from '@biosimulations/datamodel/api';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Logger,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
  Headers,
  NotImplementedException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiNotImplementedResponse,
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
import { SimulationRunStatus } from '@biosimulations/datamodel/common';
import { SimulationRunModelReturnType } from './simulation-run.model';
import { AuthToken } from '@biosimulations/auth/common';
import { timeout, catchError, retry } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@ApiTags('Simulation Runs')
@Controller('run')
@ApiExtraModels(UploadSimulationRun, UploadSimulationRunUrl, SimulationUpload)
export class SimulationRunController {
  TIMEOUT_INTERVAL = 10000;
  RETRY_COUNT = 2;
  logger: Logger;
  constructor(
    private service: SimulationRunService,
    @Inject('NATS_CLIENT') private messageClient: ClientProxy,
  ) {
    this.logger = new Logger(SimulationRunController.name);
  }

  @ApiOperation({
    summary: 'Get all the Simulation Runs',
    description:
      'Returns an array of all the Simulation Run objects in the database',
  })
  @ApiOkResponse({ description: 'OK', type: [SimulationRun] })
  @permissions('read:SimulationRuns')
  @Get()
  async getRuns(): Promise<SimulationRun[]> {
    const res = await this.service.getAll();
    return res.map(this.makeSimulationRun);
  }

  @ApiOperation({
    summary: 'Submit a simulation to run',
    description:
      'Upload an OMEX (Combine) archive along with a description of the simulator run.\
       The simulation will be excecuted and the status of the Simulation run object will be updated. \
      \nThe simulation can be uploaded as a combine archive by using the multipart/form-data accept header.\
      Alternatively, use the application/json accept header to provide a url to an external combine archive instead',
    requestBody: {
      content: {
        'multipart/form-data': {
          encoding: { body: { contentType: 'multipart/form-data' } },
          schema: { $ref: getSchemaPath(SimulationUpload) },
        },

        'application/json': {
          encoding: { body: { contentType: 'application/json' } },
          schema: { $ref: getSchemaPath(UploadSimulationRunUrl) },
        },
      },
    },
  })
  @ApiCreatedResponse({
    type: SimulationRun,
    description: 'Simulation Run Submitted',
  })
  @ApiPayloadTooLargeResponse({
    type: ErrorResponseDocument,
    description: 'Omex File is too large. Files must be less than 16Mb',
  })
  @ApiBadRequestResponse({
    type: ErrorResponseDocument,
    description: 'Request did not adhere to schema',
  })
  @ApiNotImplementedResponse({
    type: ErrorResponseDocument,
    description: 'Providing a URL is not yet supported',
  })
  @ApiUnsupportedMediaTypeResponse({
    type: ErrorResponseDocument,
    description:
      'The mediatype is unsupported. Mediatype must be application/json or multipart/form-data',
  })

  // Set a file size limit close to 16mb which is the mongodb limit
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 16000000 } }))
  @Post()
  async createRun(
    @Body() body: { simulationRun: string },
    @UploadedFile() file: any,
    @Headers('Content-Type') contentType: string,
  ): Promise<SimulationRun> {
    let urlMethod = false;
    if (!contentType.startsWith('multipart/form-data')) {
      if (contentType.startsWith('application/json')) {
        urlMethod = true;
        throw new NotImplementedException(
          'Providing a URL for the combine archive is coming soon!',
        );
      }
      throw new UnsupportedMediaTypeException(
        ' Can only accept application/json or multipart/form-data content',
      );
    }
    // Since this is a multipart, the form field for "simulationRun" contains the SimulationRun object encoding as a string
    try {
      JSON.parse(body.simulationRun);
    } catch (e) {
      throw new BadRequestException(
        'The provided input was not valid: ' + e.message,
      );
    }
    const parsedRun = JSON.parse(body.simulationRun) as SimulationRun;

    const run = await this.service.createRun(parsedRun, file);
    const response: SimulationRun = this.makeSimulationRun(run);

    const message: DispatchCreatedPayload = {
      _message: DispatchMessage.created,
      id: run.id,
      fileName: file.originalname,
      simulator: run.simulator,
      version: run.simulatorVersion,
    };

    this.sendMessage(message).subscribe((res: createdResponse) => {
      if (res.okay) {
        this.service.setStatus(response.id, SimulationRunStatus.QUEUED);
      } else {
        this.service.setStatus(response.id, SimulationRunStatus.FAILED);
      }
    });

    return response;
  }

  // Move this to a util library
  private sendMessage(message: DispatchCreatedPayload) {
    return this.messageClient.send(DispatchMessage.created, message).pipe(
      // Wait up to ten seconds for a response
      timeout(this.TIMEOUT_INTERVAL),
      // Retry sending the message 3 times
      retry(this.RETRY_COUNT),
      // If error, just return a response that is "not okay" to the calling method
      catchError(
        (err, caught): Observable<createdResponse> => {
          this.logger.error(
            ` Error submitting Simulation ${message.id}: ${err}`,
          );
          return of({
            okay: false,
            id: message.id,
            _message: DispatchMessage.created,
          });
        },
      ),
    );
  }

  /**
   *  Creates the controllers return type SimulationRun
   * @param run The value that is returned from the service.
   */
  makeSimulationRun(run: SimulationRunModelReturnType): SimulationRun {
    return new SimulationRun(
      run.id,
      run.name,
      run.simulator,
      run.simulatorVersion,
      run.status,
      run.public,
      run.submitted,
      run.updated,
      run.runtime,
      run.projectSize,
      run.resultsSize,
      run.email,
    );
  }

  @ApiOperation({
    summary: 'Get a Simulation Run',
    description: 'Returns the latest updated Simulation Run',
  })
  @ApiOkResponse({ type: SimulationRun })
  @Get(':id')
  @OptionalAuth()
  async getRun(
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
      throw new NotFoundException(`No Simulation Run with id ${id}`);
    }
  }

  @ApiOperation({
    summary: 'Modify a simulation run',
    description: 'Change the status or information of a simulation run',
  })
  @permissions('write:SimulationRuns')
  @Patch(':id')
  async modfiyRun(
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
  deleteRun(@Param('id') id: string) {
    const res = this.service.delete(id);

    if (!res) {
      throw new NotFoundException(`No Simulation Run with id ${id} found`);
    }

    return res;
  }

  @ApiOperation({
    summary: 'Delete all simulation runs',
    description: 'Delete all simulation runs',
  })
  @permissions('delete:SimulationRuns')
  @Delete()
  deleteAll() {
    return this.service.deleteAll();
  }

  @ApiOperation({
    description: 'Download the OMEX file for the Simulation Run',
  })
  @Get(':id/download')
  async download(@Param('id') id: string, @Res() response: Response) {
    const file = await this.service.download(id);

    response.setHeader('Content-Type', file.mimetype);
    const contentDisposition = `attachment; filename=${file.originalname}`;
    response.setHeader('Content-Disposition', contentDisposition);

    response.send(file.buffer);
  }
}
