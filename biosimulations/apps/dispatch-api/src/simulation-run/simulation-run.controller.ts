import { ErrorResponseDocument } from '@biosimulations/datamodel/api';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
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
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { throws } from 'assert';
import { fstat } from 'fs';
import { SimulationRun, SimulationUpload } from './simulation-run.dto';
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
  getRun(@Param() id: string) {
    return this.service.get(id);
  }

  @ApiOperation({
    summary: 'Modify a simulation run',
    description: 'Change the status or information of a simulation run',
  })
  // TODO limit this to admins/permission only. Can be used by service to update status
  @Put(':id')
  modfiyRun(@Param() id: string, @Body() run: SimulationRun) {
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
}
