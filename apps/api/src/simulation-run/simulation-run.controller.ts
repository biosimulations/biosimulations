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
  Query,
  Patch,
  Post,
  Req,
  Res,
  UploadedFile,
  UnsupportedMediaTypeException,
  HttpCode,
  UseInterceptors,
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
import { Response, Request } from 'express';
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
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
// hack to get typing to work see https://github.com/DefinitelyTyped/DefinitelyTyped/issues/47780
// eslint-disable-next-line unused-imports/no-unused-imports-ts
import multer from 'multer';
type multipartSimulationRunBody = { simulationRun: string };
// 1gb in bytes plus a buffer to be used as file size limits
const ONE_GIGABYTE = 1100000000;
@ApiTags('Simulations')
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
      'Returns an array of all the simulation run objects in the database. Access is restricted to administrators.',
  })
  @ApiOkResponse({
    description: 'The simulation runs were successfully retrieved',
    type: [SimulationRun],
  })
  @permissions('read:SimulationRuns')
  @ApiUnauthorizedResponse({
    type: ErrorResponseDocument,
    description: 'A valid authorization was not provided',
  })
  @ApiForbiddenResponse({
    type: ErrorResponseDocument,
    description:
      'This account does not have permission to get all simulation runs. Access to all runs is limited to administrators.',
  })
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
    description: 'Simulation run was successfully submitted',
  })
  @ApiBadRequestResponse({
    type: ErrorResponseDocument,
    description:
      'The simulation run request does not adhere to the expected schema. Please see https://api.biosimulations.org for more information.',
  })
  @ApiUnsupportedMediaTypeResponse({
    type: ErrorResponseDocument,
    description:
      'The submitted mediatype is unsupported. The mediatype must be `application/json` or `multipart/form-data`.',
  })
  // Set a file size limit of 1GB
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: ONE_GIGABYTE } }),
  )
  @ApiPayloadTooLargeResponse({
    type: ErrorResponseDocument,
    description:
      'The submitted COMBINE/OMEX archive file is too large. Uploaded archives must be less than 1 GB. Larger archives up to 5 TB may be submitted via URLs.',
  })
  @ApiBadRequestResponse({
    type: ErrorResponseDocument,
    description:
      'No image for the simulator/version is registered with BioSimulators',
  })
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
    let projectId: string | undefined;

    if (!contentType) {
      throw new UnsupportedMediaTypeException(' Must specifiy a Content-Type');
    } else if (contentType?.startsWith('multipart/form-data')) {
      const parsedRun = this.getRunForFile(body);
      run = await this.createRunWithFile(parsedRun, file);
      projectId = parsedRun?.projectId;
    } else if (
      contentType?.startsWith('application/json') &&
      this.isUrlBody(body)
    ) {
      run = await this.service.createRunWithURL(body);
      projectId = body?.projectId;
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
      purpose: run.purpose,
      projectId: projectId,
    };
    const sim = await this.dispatchQueue.add(message);

    return response;
  }

  private getRunForFile(
    body: multipartSimulationRunBody | UploadSimulationRunUrl,
  ): UploadSimulationRun {
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

    return parsedRun;
  }

  private async createRunWithFile(
    run: UploadSimulationRun,
    file: Express.Multer.File,
  ): Promise<SimulationRunModelReturnType> {
    return this.service.createRunWithFile(run, file);
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
  @permissions('read:SimulationRuns')
  @ApiUnauthorizedResponse({
    type: ErrorResponseDocument,
    description: 'A valid authorization was not provided',
  })
  @ApiForbiddenResponse({
    type: ErrorResponseDocument,
    description:
      'This account does not have permission to get all simulation runs. Access to all runs is limited to administrators.',
  })
  @ApiOkResponse({
    description: 'A summary of each run was successfully retrieved',
    type: [SimulationRunSummary],
  })
  @Get('summary')
  public async getRunSummaries(
  ): Promise<SimulationRunSummary[]> {
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
  })
  @ApiOkResponse({
    description:
      'Information about the simulation run was successfully retrieved',
    type: SimulationRun,
  })
  @ApiNotFoundResponse({
    description: 'No simulation run has the requested id',
    type: ErrorResponseDocument,
  })
  @Get(':runId')
  @OptionalAuth()
  public async getRun(
    @Param('runId') runId: string,
    @Req() req: Request,
  ): Promise<SimulationRun> {
    const user = req?.user as AuthToken;
    let permission = false;
    if (user) {
      user.permissions = user.permissions || [];
      permission = user.permissions.includes('read:Email');
    }
    const run = await this.service.get(runId);
    if (run) {
      permission ? null : (run.email = null);
      return this.makeSimulationRun(run);
    } else {
      throw new NotFoundException(`No simulation run with id ${runId}`);
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
  })
  @permissions('write:SimulationRuns')
  @ApiUnauthorizedResponse({
    type: ErrorResponseDocument,
    description: 'A valid authorization was not provided',
  })
  @ApiForbiddenResponse({
    type: ErrorResponseDocument,
    description:
      'This account does not have permission to save simulation runs',
  })
  @Patch(':runId')
  @ApiNotFoundResponse({
    description: 'No simulation run has the requested id',
    type: ErrorResponseDocument,
  })
  @ApiOkResponse({
    description: 'The simulation run was successfully updated',
    type: SimulationRun,
  })
  public async modifyRun(
    @Param('runId') runId: string,
    @Body() body: UpdateSimulationRun,
  ): Promise<SimulationRun> {
    this.logger.log(`Patch called for ${runId} with ${JSON.stringify(body)}`);
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
  })
  @ApiNotFoundResponse({
    description: 'No simulation run has the requested id',
    type: ErrorResponseDocument,
  })
  @permissions('delete:SimulationRuns')
  @ApiUnauthorizedResponse({
    type: ErrorResponseDocument,
    description: 'A valid authorization was not provided',
  })
  @ApiForbiddenResponse({
    type: ErrorResponseDocument,
    description:
      'This account does not have permission to delete simulation runs',
  })
  @Delete(':runId')
  @ApiOkResponse({
    type: SimulationRun,
    description: 'The simulation run was successfully deleted',
  })
  public async deleteRun(
    @Param('runId') runId: string,
  ): Promise<SimulationRun> {
    const res = await this.service.delete(runId);

    if (!res) {
      throw new NotFoundException(`No simulation run with id ${runId} found`);
    }

    return this.makeSimulationRun(res);
  }

  @ApiOperation({
    summary: 'Delete all simulation runs',
    description: 'Delete all simulation runs',
  })
  @permissions('delete:SimulationRuns')
  @ApiUnauthorizedResponse({
    type: ErrorResponseDocument,
    description: 'A valid authorization was not provided',
  })
  @ApiForbiddenResponse({
    type: ErrorResponseDocument,
    description:
      'This account does not have permission to delete simulation runs',
  })
  @Delete()
  @ApiNoContentResponse({
    description: 'The simulation runs were successfully deleted',
  })
  @HttpCode(204)
  public deleteAll(): Promise<void> {
    return this.service.deleteAll();
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
  })
  @ApiNotFoundResponse({
    description:
      'No COMBINE/OMEX archive is available for the requested simulation run id',
    type: ErrorResponseDocument,
  })
  @Get(':runId/download')
  @ApiResponse({
    status: 302,
    description:
      'The request was successfully redirected to download the COMBINE/OMEX archive for the run',
  })
  @ApiTags('Downloads')
  public async download(
    @Param('runId') runId: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    const file = await this.service.download(runId);
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

  @ApiOperation({
    summary: 'Get a summary of a run',
    description: 'Returns a summary of the run',
  })
  @ApiParam({
    name: 'runId',
    description: 'Id of the run',
    required: true,
    type: String,
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
  public async getRunSummary(
    @Param('runId') runId: string,
  ): Promise<SimulationRunSummary> {
    const summary = await this.service.getRunSummary(runId);
    return summary;
  }

  @Get(':runId/validate')
  @ApiOperation({
    summary: 'Validate a simulation run',
    description:
      'Check whether a simulation is valid for publication (e.g, succeeded and provides the [minimum required metadata](https://biosimulators.org/conventions/metadata). Returns 204 (No Content) for a publishable run, or a 400 (Bad Input) for a run that cannot be published. 400 errors include diagnostic information which describe why the run cannot be published.',
  })
  @ApiParam({
    name: 'runId',
    description: 'Id of a simulation run',
    required: true,
    type: String,
  })
  @ApiQuery({
    name: 'validateSimulationResultsData',
    description:
      'Whether to validate the data (e.g., numerical simulation results) for each SED-ML report and plot for each SED-ML document. Default: false.',
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
  @HttpCode(204)
  public async validateRun(
    @Param('runId') runId: string,
    @Query('validateSimulationResultsData')
    validateSimulationResultsData = 'false',
  ): Promise<void> {
    await this.service.validateRun(
      runId,
      validateSimulationResultsData == 'true',
    );
    return;
  }
}
