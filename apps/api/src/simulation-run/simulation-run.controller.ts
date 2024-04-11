/* eslint-disable @typescript-eslint/member-ordering */
/**
 * @file Contains the controller for CRUD operations on simulation runs
 * @author Bilal Shaikh, Jonathan Karr
 * @copyright BioSimulations Team 2020
 * @license MIT
 */
import {
  JobQueue,
  SubmitFileSimulationRunJobData,
  SubmitURLSimulationRunJobData,
} from '@biosimulations/messages/messages';
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
  ForbiddenException,
  Param,
  Query,
  Patch,
  Post,
  Req,
  UploadedFile,
  UnsupportedMediaTypeException,
  HttpCode,
  UseInterceptors,
  HttpStatus,
  Redirect,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiResponse,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiNoContentResponse,
  ApiOperation,
  ApiPayloadTooLargeResponse,
  ApiTags,
  ApiNotFoundResponse,
  ApiUnsupportedMediaTypeResponse,
  getSchemaPath,
  ApiParam,
  ApiQuery,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { Request } from 'express';
import {
  SimulationRun,
  SimulationUpload,
  UpdateSimulationRun,
  UploadSimulationRun,
  UploadSimulationRunUrl,
  SimulationRunSummary,
} from '@biosimulations/datamodel/api';
import { SimulationRunService } from './simulation-run.service';
import { SimulationRunModelReturnType } from './simulation-run.model';
import { AuthToken } from '@biosimulations/auth/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { scopes } from '@biosimulations/auth/common';

// hack to get typing to work see https://github.com/DefinitelyTyped/DefinitelyTyped/issues/47780
// eslint-disable-next-line unused-imports/no-unused-imports-ts
import multer from 'multer';
import { SimulationRunValidationService } from './simulation-run-validation.service';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { FormatService } from '../../../../libs/shared/services/src/lib/format/format.service';

type multipartSimulationRunBody = { simulationRun: string };
const FILE_UPLOAD_LIMIT = 64e6; // bytes (64 MB)

@ApiTags('Simulations')
@Controller('runs')
@ApiExtraModels(UploadSimulationRun, UploadSimulationRunUrl, SimulationUpload)
export class SimulationRunController {
  private logger: Logger;

  public constructor(
    private service: SimulationRunService,
    private validationService: SimulationRunValidationService,
    @InjectQueue(JobQueue.submitSimulationRun)
    private readonly sumbitQ: Queue<
      SubmitURLSimulationRunJobData | SubmitFileSimulationRunJobData,
      void,
      JobQueue.submitSimulationRun
    >,
  ) {
    this.logger = new Logger(SimulationRunController.name);
  }

  private isFileUploadBody(
    body: multipartSimulationRunBody | UploadSimulationRunUrl,
  ): body is multipartSimulationRunBody {
    return (<multipartSimulationRunBody>body).simulationRun != undefined;
  }

  private isUrlBody(body: multipartSimulationRunBody | UploadSimulationRunUrl): body is UploadSimulationRunUrl {
    return (<UploadSimulationRunUrl>body).url != undefined;
  }

  @ApiOperation({
    summary: 'Get all of the simulation runs',
    description:
      'Returns an array of all the simulation run objects in the database. Access is restricted to administrators.',
  })
  @ApiOkResponse({
    description: 'The simulation runs were successfully retrieved',
    type: [SimulationRun],
  })
  @ApiUnauthorizedResponse({
    type: ErrorResponseDocument,
    description: 'A valid authorization was not provided',
  })
  @ApiForbiddenResponse({
    type: ErrorResponseDocument,
    description:
      'This account does not have permission to get all simulation runs. Access to all runs is limited to administrators.',
  })
  @permissions(scopes.simulationRuns.read.id)
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
      \nThe simulation can be uploaded as a COMBINE/OMEX archive by using the multipart/form-data accept header.\
      Alternatively, use the application/json accept header to provide a URL to an external COMBINE/OMEX archive',
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
    description: 'Simulation run was successfully submitted',
  })
  @ApiBadRequestResponse({
    type: ErrorResponseDocument,
    description:
      'The simulation run request does not adhere to the expected schema.\
      Please see https://api.biosimulations.org for more information.',
  })
  @ApiUnsupportedMediaTypeResponse({
    type: ErrorResponseDocument,
    description:
      'The submitted mediatype is unsupported. The mediatype must be `application/json` or `multipart/form-data`.',
  })
  // Set a file size limit of 1GB
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 1.1 * FILE_UPLOAD_LIMIT } }))
  @ApiPayloadTooLargeResponse({
    type: ErrorResponseDocument,
    description: `The submitted COMBINE/OMEX archive file is too large.\
     Uploaded archives must be less than ${FormatService.formatDigitalSize(FILE_UPLOAD_LIMIT)}.`,
  })
  @ApiBadRequestResponse({
    type: ErrorResponseDocument,
    description: 'No image for the simulator/version is registered with BioSimulators',
  })
  @OptionalAuth()
  @ApiInternalServerErrorResponse({
    description: 'An error occurred in retrieving the simulator/version',
    type: ErrorResponseDocument,
  })
  @Post()
  public async createRun(
    @Body() body: multipartSimulationRunBody | UploadSimulationRunUrl,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ): Promise<SimulationRun> {
    const contentType = req.header('Content-Type');
    let run: SimulationRunModelReturnType;
    const user = req?.user as AuthToken;
    let projectId: string | undefined;

    if (!contentType) {
      throw new UnsupportedMediaTypeException("The content type must be 'application/json' or 'multipart/form-data'.");
    } else if (contentType?.startsWith('multipart/form-data')) {
      const parsedRun = this.getRunForFile(body);
      projectId = parsedRun?.projectId;
      this.checkPublishProjectPermission(user, projectId);
      run = await this.service.createRunWithFile(parsedRun, file.buffer, file.size);
      const message: SubmitFileSimulationRunJobData = {
        runId: run.id,
        fileName: file?.originalname || 'archive.omex',
        simulator: run.simulator,
        simulatorVersion: run.simulatorVersion,
        cpus: run.cpus,
        memory: run.memory,
        maxTime: run.maxTime,
        envVars: run.envVars,
        purpose: run.purpose,
        projectId: projectId,
        projectOwner: user?.sub,
      };

      await this.sumbitSimulation(message);
    } else if (contentType?.startsWith('application/json') && this.isUrlBody(body)) {
      projectId = body?.projectId;
      this.checkPublishProjectPermission(user, projectId);
      run = await this.service.createRunWithURL(body);

      const message: SubmitURLSimulationRunJobData = {
        runId: run.id,
        fileUrl: body.url,
        simulator: run.simulator,
        simulatorVersion: run.simulatorVersion,
        cpus: run.cpus,
        memory: run.memory,
        maxTime: run.maxTime,
        envVars: run.envVars,
        purpose: run.purpose,
        projectId: projectId,
        projectOwner: user?.sub,
      };
      await this.sumbitSimulation(message);
    } else {
      throw new UnsupportedMediaTypeException("The content type must be 'application/json' or 'multipart/form-data'.");
    }
    const response = this.makeSimulationRun(run);
    return response;
  }

  // TODO move to service to get strong typing without needing to define queue types as above
  private async sumbitSimulation(
    message: SubmitFileSimulationRunJobData | SubmitURLSimulationRunJobData,
  ): Promise<void> {
    await this.sumbitQ.add(JobQueue.submitSimulationRun, message, {
      attempts: 10,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
      removeOnComplete: 100,
      removeOnFail: 100,
    });
  }

  private checkPublishProjectPermission(user: AuthToken, projectId?: string): void {
    if (projectId && !user?.permissions?.includes(scopes.simulationRuns.externallyValidate.id)) {
      throw new ForbiddenException(
        'This account does not have permission to submit publication requests with simulation run requests. \
        To publish a simulation run with this account, first request a run, \
        then review the results of the run, and then publish the run.',
      );
    }
  }

  private getRunForFile(body: multipartSimulationRunBody | UploadSimulationRunUrl): UploadSimulationRun {
    if (this.isFileUploadBody(body)) {
      try {
        // We are making an unsafe assertion here, since the body could have any type.
        // This should be caught by the database validation however
        return JSON.parse(body.simulationRun) as UploadSimulationRun;
      } catch (e) {
        const message = e instanceof Error && e.message ? e.message : '';
        throw new BadRequestException(
          "The 'simulationRun' field of the body of the request is not a valid JSON document: " + message,
        );
      }
    } else {
      throw new BadRequestException("The body of the simulation run request must include a 'simulationRun' field.");
    }
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
      run.simulatorDigest,
      run.cpus,
      run.memory,
      run.maxTime,
      run.envVars,
      run.purpose,
      run.submitted,
      run.updated,
      run.status,
      run.runtime,
      run.projectSize,
      run.resultsSize,
      run.email,
    );
  }

  @ApiOperation({
    summary: 'Get a summary of each run',
    description: 'Returns a summary of each run',
  })
  @ApiUnauthorizedResponse({
    type: ErrorResponseDocument,
    description: 'A valid authorization was not provided',
  })
  @ApiForbiddenResponse({
    type: ErrorResponseDocument,
    description:
      'This account does not have permission to get all simulation runs. Access to all runs is limited to administrators.',
  })
  @permissions(scopes.simulationRuns.read.id)
  @ApiOkResponse({
    description: 'A summary of each run was successfully retrieved',
    type: [SimulationRunSummary],
  })
  @Get('summary')
  public async getRunSummaries(): Promise<SimulationRunSummary[]> {
    const summary = await this.service.getRunSummaries();
    return summary;
  }

  @ApiOperation({
    summary: 'Get a simulation run',
    description: 'Get information about a simulation run',
  })
  @ApiParam({
    name: 'runId',
    description: 'Id of a simulation run',
    required: true,
    type: String,
    schema: {
      pattern: '^[a-f\\d]{24}$',
    },
  })
  @ApiOkResponse({
    description: 'Information about the simulation run was successfully retrieved',
    type: SimulationRun,
  })
  @ApiNotFoundResponse({
    description: 'No simulation run has the requested id',
    type: ErrorResponseDocument,
  })
  @Get(':runId')
  @OptionalAuth()
  public async getRun(@Param('runId') runId: string, @Req() req: Request): Promise<SimulationRun> {
    const user = req?.user as AuthToken;
    let permission = false;
    if (user) {
      user.permissions = user.permissions || [];
      permission = user.permissions.includes(scopes.email.read.id);
    }
    const run = await this.service.get(runId);
    if (run) {
      permission ? null : (run.email = null);
      return this.makeSimulationRun(run);
    } else {
      throw new NotFoundException(`A simulation run with id '${runId}' could not be found.`);
    }
  }

  @ApiOperation({
    summary: 'Modify a simulation run',
    description: 'Change the status or information of a simulation run',
    requestBody: {
      content: {
        'application/json': {
          encoding: { body: { contentType: 'application/json' } },
          schema: { $ref: getSchemaPath(UpdateSimulationRun) },
        },
      },
    },
  })
  @ApiParam({
    name: 'runId',
    description: 'Id of a simulation run',
    required: true,
    type: String,
    schema: {
      pattern: '^[a-f\\d]{24}$',
    },
  })
  @ApiUnauthorizedResponse({
    type: ErrorResponseDocument,
    description: 'A valid authorization was not provided',
  })
  @ApiForbiddenResponse({
    type: ErrorResponseDocument,
    description: 'This account does not have permission to save simulation runs',
  })
  @permissions(scopes.simulationRuns.update.id)
  @Patch(':runId')
  @ApiNotFoundResponse({
    description: 'No simulation run has the requested id',
    type: ErrorResponseDocument,
  })
  @ApiOkResponse({
    description: 'The simulation run was successfully updated',
    type: SimulationRun,
  })
  public async modifyRun(@Param('runId') runId: string, @Body() body: UpdateSimulationRun): Promise<SimulationRun> {
    this.logger.log(`Patch called for simulation run '${runId}' with ${JSON.stringify(body)}`);
    const run = await this.service.update(runId, body);
    return this.makeSimulationRun(run);
  }

  @ApiOperation({
    summary: 'Delete a simulation run',
    description: 'Delete a simulation run',
  })
  @ApiParam({
    name: 'runId',
    description: 'Id of a simulation run',
    required: true,
    type: String,
    schema: {
      pattern: '^[a-f\\d]{24}$',
    },
  })
  @ApiNotFoundResponse({
    description: 'No simulation run has the requested id',
    type: ErrorResponseDocument,
  })
  @ApiBadRequestResponse({
    type: ErrorResponseDocument,
    description: 'Run cannot be deleted because it has been published as a project',
  })
  @ApiUnauthorizedResponse({
    type: ErrorResponseDocument,
    description: 'A valid authorization was not provided',
  })
  @ApiForbiddenResponse({
    type: ErrorResponseDocument,
    description: 'This account does not have permission to delete simulation runs',
  })
  @permissions(scopes.simulationRuns.delete.id)
  @Delete(':runId')
  @ApiNoContentResponse({
    description: 'The simulation run was successfully deleted',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteRun(@Param('runId') runId: string): Promise<void> {
    await this.service.delete(runId);
  }

  @ApiOperation({
    summary: 'Delete all simulation runs',
    description: 'Delete all simulation runs',
  })
  @ApiBadRequestResponse({
    type: ErrorResponseDocument,
    description: 'Runs cannot be deleted because some have been published as projects',
  })
  @ApiUnauthorizedResponse({
    type: ErrorResponseDocument,
    description: 'A valid authorization was not provided',
  })
  @ApiForbiddenResponse({
    type: ErrorResponseDocument,
    description: 'This account does not have permission to delete simulation runs',
  })
  @permissions(scopes.simulationRuns.delete.id)
  // @Delete()
  @ApiNoContentResponse({
    description: 'The simulation runs were successfully deleted',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteAll(): Promise<void> {
    await this.service.deleteAll();
  }

  @ApiOperation({
    summary: 'Download the COMBINE/OMEX archive for the simulation run',
    description: 'Download the COMBINE/OMEX archive for the simulation run',
  })
  @ApiParam({
    name: 'runId',
    description: 'Id of a simulation run',
    required: true,
    type: String,
    schema: {
      pattern: '^[a-f\\d]{24}$',
    },
  })
  @ApiNotFoundResponse({
    description: 'No COMBINE/OMEX archive is available for the requested simulation run id',
    type: ErrorResponseDocument,
  })
  @Get(':runId/download')
  @ApiResponse({
    status: HttpStatus.MOVED_PERMANENTLY,
    description: 'The request was successfully redirected to download the COMBINE/OMEX archive for the run',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The request successfully  downloaded the COMBINE/OMEX archive for the run',
  })
  @ApiTags('Downloads')
  @Redirect()
  // The return type is used by the redirect decorator
  public async download(@Param('runId') runId: string): Promise<{
    url: string;
    statusCode: number;
  }> {
    const url = await this.service.getFileUrl(runId);

    return {
      url: url,
      statusCode: HttpStatus.MOVED_PERMANENTLY,
    };
  }

  @ApiOperation({
    summary: 'Get a summary of a run',
    description: 'Returns a summary of the run',
  })
  @ApiParam({
    name: 'runId',
    description: 'Id of the run',
    required: true,
    type: String,
    schema: {
      pattern: '^[a-f\\d]{24}$',
    },
  })
  @ApiOkResponse({
    description: 'A summary of the run was successfully retrieved',
    type: SimulationRunSummary,
  })
  @ApiNotFoundResponse({
    description: 'No run could be found with requested id',
    type: ErrorResponseDocument,
  })
  @Get(':runId/summary')
  public async getRunSummary(@Param('runId') runId: string): Promise<SimulationRunSummary> {
    const summary = await this.service.getRunSummary(runId);
    return summary;
  }

  @Get(':runId/validate')
  @ApiOperation({
    summary: 'Validate a simulation run',
    description:
      'Check whether a simulation is valid for publication \
      (i.e, succeeded and provides the \
      [minimum required metadata](https://docs.biosimulations.org/concepts/conventions/simulation-project-metadata/). \
      Returns 204 (No Content) for a publishable run, or a 400 (Bad Input) for a run that cannot be published. \
      400 errors include diagnostic information which describe why the run cannot be published.',
  })
  @ApiParam({
    name: 'runId',
    description: 'Id of a simulation run',
    required: true,
    type: String,
    schema: {
      pattern: '^[a-f\\d]{24}$',
    },
  })
  @ApiQuery({
    name: 'validateSimulationResultsData',
    description:
      'Whether to validate the data (i.e., numerical simulation results)\
       for each SED-ML report and plot for each SED-ML document. Default: false.',
    required: false,
    type: Boolean,
  })
  @ApiBadRequestResponse({
    type: ErrorResponseDocument,
    description: 'The simulation run is not valid.',
  })
  @ApiNoContentResponse({
    description: 'The simulation run is valid.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  public async validateRun(
    @Param('runId') runId: string,
    @Query('validateSimulationResultsData')
    validateSimulationResultsData = 'false',
  ): Promise<void> {
    await this.validationService.validateRun(
      runId,
      ['true', '1'].includes(validateSimulationResultsData.toLowerCase()),
    );
    return;
  }
}
