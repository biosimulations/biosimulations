/**
 * @file Contains the controller for CRUD operations on simulation runs
 * @author Bilal Shaikh
 * @copyright Biosimulations Team 2020
 * @license MIT
 */
import { MQDispatch } from '@biosimulations/messages';
import {
  AdminGuard,
  JwtGuard,
  permissions,
  PermissionsGuard,
} from '@biosimulations/auth/nest';
import { ClientProxy } from '@nestjs/microservices';
import { ErrorResponseDocument } from '@biosimulations/datamodel/api';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOAuth2,
  ApiOkResponse,
  ApiOperation,
  ApiPayloadTooLargeResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import {
  SimulationRun,
  SimulationUpload,
  UpdateSimulationRun,
} from './simulation-run.dto';
import { SimulationRunService } from './simulation-run.service';

@ApiTags('Simulation Runs')
@Controller('run')
export class SimulationRunController {
  constructor(
    private service: SimulationRunService,
    @Inject('DISPATCH_MQ') private messageClient: ClientProxy,
  ) { }

  @ApiOperation({
    summary: 'Get all the Simulation Runs',
    description:
      'Returns an array of all the Simulation Run objects in the database',
  })
  @ApiOkResponse({ description: 'OK', type: [SimulationRun] })
  @UseGuards(JwtGuard, PermissionsGuard)
  @permissions('read:SimulationRuns')
  @ApiOAuth2(['read:SimulationRuns'])
  @Get()
  async getRuns(): Promise<SimulationRun[]> {
    const res = await this.service.getAll();
    return res.map(
      (run) =>
        new SimulationRun(
          run.id,
          run.name,
          run.simulator,
          run.simulatorVersion,
          run.status,
          run.public,
          run.submitted,
          run.updated,
          run.duration,
          run.projectSize,
          run.resultsSize,
          run.email
        )
    );
  }

  @ApiOperation({
    summary: 'Submit a simulation to run',
    description:
      'Upload an OMEX (Combine) archive along with a description of the simulator run.\
      The simulation will be excecuted and the status of the Simulation run object will be updated.',
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
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: SimulationUpload })
  // Set a file size limit close to 16mb which is the mongodb limit
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 16000000 } }))
  @Post()
  async createRun(
    @Body() body: { simulationRun: string },
    @UploadedFile() file: any
  ): Promise<SimulationRun> {
    // Since this is a multipart, the form field for "simulationRun" contains the SimulationRun object encoding as a string
    try {
      JSON.parse(body.simulationRun);
    } catch (e) {
      console.log(e);
      throw new BadRequestException(
        'The provided input was not valid: ' + e.message
      );
    }
    const parsedRun = JSON.parse(body.simulationRun) as SimulationRun;

    const run = await this.service.createRun(parsedRun, file);

    // console.log('start to Dispatch with filename: ', file.originalname)
    this.messageClient.send(MQDispatch.SIM_DISPATCH_START,
      {
        simulationId: run.id,
        omexFileName: file.originalname,
        simulator: run.simulator,
        simulatorVersion: run.simulatorVersion
      })
      .subscribe(dat => {
        // TODO: Make MQ work without this subscription
        // console.log('event dispatched: ', dat)
      });


    return new SimulationRun(
      run.id,
      run.name,
      run.simulator,
      run.simulatorVersion,
      run.status,
      run.public,
      run.submitted,
      run.updated,
      run.duration,
      run.projectSize,
      run.resultsSize,
      run.email
    );
  }

  @ApiOperation({
    summary: 'Get a Simulation Run',
    description: 'Returns the latest updated Simulation Run',
  })
  @ApiOkResponse({ type: SimulationRun })
  @Get(':id')
  async getRun(@Param('id') id: string): Promise<SimulationRun> {
    const run = await this.service.get(id);
    if (run) {
      return new SimulationRun(
        run.id,
        run.name,
        run.simulator,
        run.simulatorVersion,
        run.status,
        run.public,
        run.submitted,
        run.updated,
        run.duration,
        run.projectSize,
        run.resultsSize,
        run.email
      );
    }
    throw new NotFoundException(`No Simulation Run with id ${id}`);
  }

  @ApiOperation({
    summary: 'Modify a simulation run',
    description: 'Change the status or information of a simulation run',
  })
  @UseGuards(JwtGuard, PermissionsGuard)
  @permissions('write:SimulationRuns')
  @ApiOAuth2(['write:SimulationRuns'])
  @Patch(':id')
  modfiyRun(@Param() id: string, @Body() body: UpdateSimulationRun) {
    const run = this.service.update(id, body);
  }

  @ApiOperation({
    summary: 'Delete a simulation run',
    description: 'Delete a simulation run',
  })
  @UseGuards(JwtGuard, PermissionsGuard)
  @permissions('delete:SimulationRuns')
  @Delete(':id')
  deleteRun(@Param() id: string, @Body() run: SimulationRun) {
    const res = this.service.delete(id);
    if (res) {
      return res;
    } else {
      throw new NotFoundException(`No Simulation Run with id ${id} found`);
    }
  }

  @ApiOperation({
    summary: 'Delete all simulation runs',
    description: 'Delete all simulation runs',
  })
  @UseGuards(JwtGuard, PermissionsGuard)
  @permissions('delete:SimulationRuns')
  @ApiOAuth2(['delete:SimulationRuns'])
  @Delete()
  deleteAll(@Param() id: string, @Body() run: SimulationRun) {
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
