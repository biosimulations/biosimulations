/**
 * @file Contains the controller for CRUD operations on simulation runs
 * @author Bilal Shaikh
 * @copyright Biosimulations Team 2020
 * @license MIT
 */
import { ErrorResponseDocument } from '@biosimulations/datamodel/api';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
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
  constructor(private service: SimulationRunService) {}

  // TODO limit this to admins/permission only
  @ApiOperation({
    summary: 'Get all the Simulation Runs',
    description:
      'Returns an array of all the Simulation Run objects in the database',
  })
  @ApiOkResponse({ description: 'OK', type: [SimulationRun] })
  @Get()
  getRuns() {
    return this.service.getAll();
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
  createRun(@Body() run: { simulationRun: string }, @UploadedFile() file: any) {
    // Since this is a multipart, the form field for "simulationRun" contains the SimulationRun object encoding as a string
    try {
      JSON.parse(run.simulationRun);
    } catch (e) {
      console.log(e);
      throw new BadRequestException(
        'The provided input was not valid: ' + e.message
      );
    }
    const parsedRun = JSON.parse(run.simulationRun) as SimulationRun;

    return this.service.createRun(parsedRun, file);
  }

  @ApiOperation({
    summary: 'Get a Simulation Run',
    description: 'Returns the latest updated Simulation Run',
  })
  @ApiOkResponse({ type: SimulationRun })
  @Get(':id')
  async getRun(@Param('id') id: string): Promise<SimulationRun> {
    const run = await this.service.get(id);
    if (!!run) {
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
  // TODO limit this to admins/permission only. Can be used by service to update status
  @Patch(':id')
  modfiyRun(@Param() id: string, @Body() run: UpdateSimulationRun) {
    //TODO determine which feilds can be updated. Either in buissness logic or schema
    this.service.update(id, run);
  }

  @ApiOperation({
    summary: 'Delete a simulation run',
    description: 'Delete a simulation run',
  })
  @Delete(':id')
  deleteRun(@Param() id: string, @Body() run: SimulationRun) {
    this.service.delete(id);
  }

  @ApiOperation({
    summary: 'Delete all simulation runs',
    description: 'Delete all simulation runs',
  })
  @Delete()
  deleteAll(@Param() id: string, @Body() run: SimulationRun) {
    this.service.deleteAll(id);
  }

  @ApiOperation({
    description: 'Download the OMEX file for the Simulation Run',
  })
  @Get(':id/download')
  async download(@Param('id') id: string, @Res() response: Response) {
    // TODO can this can be done without using the Res decorator?
    // See https://docs.nestjs.com/controllers#request-object
    const file = await this.service.download(id);
    console.log(file.buffer);
    response.setHeader('Content-Type', file.mimetype);
    const contentDisposition = `attachment; filename=${file.originalname}`;
    response.setHeader('Content-Disposition', contentDisposition);

    response.send(file.buffer);
  }
}
