import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Query,
  UseGuards,
  NotFoundException,
  Put,
  BadRequestException,
  HttpCode,
} from '@nestjs/common';
import * as mongoose from 'mongoose';

import { AdminGuard, JwtGuard } from '@biosimulations/auth/nest';
import {
  ApiTags,
  ApiBody,
  ApiQuery,
  ApiParam,
  ApiOAuth2,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiBadRequestResponse,
  ApiNoContentResponse,
} from '@nestjs/swagger';
import { Simulator } from '@biosimulations/simulators/api-models';
import { SimulatorsService } from './simulators.service';
import { ErrorResponseDocument } from '@biosimulations/shared/datamodel-api';
import { BiosimulationsException } from '@biosimulations/shared/exceptions';

@ApiTags('Simulators')
@Controller('simulators')
export class SimulatorsController {
  constructor(private service: SimulatorsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all simulators and versions',
    description:
      'Returns a list of all of the available simulators. A unique simulator is identified by its id and version field.',
  })
  @ApiOkResponse({ description: 'OK', type: [Simulator] })
  getSimulators() {
    return this.service.findAll();
  }

  @Get('latest')
  @ApiOkResponse({ description: 'OK', type: [Simulator] })
  @ApiNotFoundResponse({
    type: ErrorResponseDocument,
    description: 'Not Found',
  })
  @ApiOperation({
    summary: 'Get the latest version of each simulator',
    description:
      'Returns a list of the latest version of each simulator. Specify a value for the id query parameter to get the latest version of a particular simulator',
  })
  @ApiQuery({
    name: 'id',
    required: false,
    type: String,
  })
  async getLatestSimulators(@Query('id') id: string): Promise<Simulator[]> {
    const allSims = await this.service.findAll();
    const latest = new Map<string, Simulator>();
    console.log(allSims);
    allSims.forEach((element) => {
      const latestSim = latest.get(element.id);
      if (latestSim) {
        const latestVersion = latestSim.version;
        const currentVersion = element.version;
        if (currentVersion > latestVersion) {
          latest.set(element.id, element);
        }
      } else {
        console.log(`adding ${element.id} to ${element.version}`);
        latest.set(element.id, element);
      }
    });
    console.log(latest);
    const results = Array.from(latest.values());
    if (id) {
      return results.filter((value) => value.id === id);
    } else {
      return results;
    }
  }
  @Get(':id')
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
  })
  @ApiOkResponse({ type: [Simulator] })
  @ApiNotFoundResponse({
    type: ErrorResponseDocument,
    description: 'Simulator not found',
  })
  async getSimulator(@Param('id') id: string) {
    return await this.getSimulatorById(id);
  }

  @Get(':id/:version')
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
  })
  @ApiParam({
    name: 'version',
    required: false,
    type: String,
  })
  @ApiOkResponse({ type: Simulator })
  @ApiNotFoundResponse({
    type: ErrorResponseDocument,
    description: 'Simulator not found',
  })
  async getSimulatorVersion(
    @Param('id') id: string,
    @Param('version') version: string
  ): Promise<Simulator> {
    return this.getSimulatorByVersion(id, version);
  }
  private async getSimulatorById(id: string) {
    const res = await this.service.findById(id);
    if (!res?.length) {
      throw new NotFoundException(`Simulator with id ${id} was not found`);
    }
    return res;
  }
  private async getSimulatorByVersion(id: string, version: string) {
    const res = await this.service.findByVersion(id, version);
    if (!res) {
      if (version) {
        console.log(version);
        throw new NotFoundException(
          `Simulator with id ${id} and version ${version} was not found`
        );
      } else {
        throw new NotFoundException(`Simulator with id ${id} was not found`);
      }
    }

    return res;
  }
  @UseGuards(AdminGuard)
  @ApiOAuth2([])
  @Post()
  @ApiBody({
    type: Simulator,
  })
  @ApiCreatedResponse({ type: Simulator })
  @ApiUnauthorizedResponse({ type: ErrorResponseDocument })
  @ApiForbiddenResponse({ type: ErrorResponseDocument })
  @ApiBadRequestResponse({ type: ErrorResponseDocument })
  async create(@Body() doc: Simulator): Promise<Simulator[]> {
    return this.service.new(doc);
  }

  @Post('validate')
  @ApiOperation({
    summary: 'Validate a simulator schema',
    description:
      'Takes in a simulator description. Returns 204 (No Content) for a correct schema, or a 400 (Bad Input) for a incorrect schema. Does not check authentication',
  })
  @ApiBody({
    type: Simulator,
  })
  @ApiBadRequestResponse({ type: ErrorResponseDocument })
  @ApiNoContentResponse({ description: 'No Content' })
  @HttpCode(204)
  async validateSimulator(@Body() doc: Simulator) {
    await this.service
      .validate(doc)
      .catch((err) => SimulatorsController.handleValidationError(err));
    return;
  }

  @UseGuards(AdminGuard)
  @ApiOAuth2([])
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
  })
  @ApiParam({
    name: 'version',
    required: true,
    type: String,
  })
  @ApiOkResponse({
    type: Simulator,
    description: 'Ok',
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDocument,
    description: 'No such simulator',
  })
  @ApiUnauthorizedResponse({
    type: ErrorResponseDocument,
    description: 'No permission to edit simulators',
  })
  @ApiForbiddenResponse({
    type: ErrorResponseDocument,
    description: 'No permission to edit simulator',
  })
  @ApiBadRequestResponse({
    type: ErrorResponseDocument,
    description: 'Request body does not match schema',
  })
  @Put(':id/:version')
  async update(
    @Body() doc: Simulator,
    @Param('id') id: string,
    @Param('version') version: string
  ) {
    return this.service
      .replace(id, version, doc)
      .then((res) => res)
      .catch((err) => {
        if (err?.status == 404) {
          throw err;
        }
        // TODO Replace with an filter for validation errors
        if (err?.name === 'ValidationError') {
          SimulatorsController.handleValidationError(err);
        }
      });
  }

  static handleValidationError(err: mongoose.Error.ValidationError) {
    const details = [];
    const path = [];

    for (const key in err.errors) {
      const validatorError = err.errors[key];

      details.push(validatorError.message);
      path.push('/' + key); //add a starting slash as per RFC 6901
      console.log(validatorError.name);
    }
    // Change this to an exception that can contain multiple other exceptions
    throw new BiosimulationsException(
      400,
      'Validation Error',
      details.join(', '),
      undefined,
      undefined,
      path.join(', ').replace(new RegExp('\\.', 'g'), '/') //Change the "." in the path to  "/" to make a valid JSON path
    );
  }
}
