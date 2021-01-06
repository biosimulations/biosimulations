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
  Delete,
  HttpCode,
} from '@nestjs/common';

import {
  AdminGuard,
  JwtGuard,
  permissions,
  PermissionsGuard,
} from '@biosimulations/auth/nest';
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
  ApiConflictResponse,
} from '@nestjs/swagger';
import { Simulator } from '@biosimulations/simulators/api-models';
import { SimulatorsService } from './simulators.service';
import { ErrorResponseDocument } from '@biosimulations/datamodel/api';

@ApiTags('Simulators')
@Controller('simulators')
export class SimulatorsController {
  constructor(private service: SimulatorsService) { }

  @Get()
  @ApiOperation({
    summary: 'Get all simulators and all of their versions',
    description:
      'Returns a list of the specifications of each available version of each simulators.',
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
    summary: 'Get the latest version of each simulator, or of a particular simulator',
    description:
      'Returns a list of the specifications of the latest version of each simulator, ' +
      'or a list with one element which is the specifications of the latest version of a particular simulator.',
  })
  @ApiQuery({
    name: 'id',
    required: false,
    type: String,
  })
  async getLatestSimulators(@Query('id') id?: string): Promise<Simulator[]> {
    const allSims = await this.service.findAll();
    const latest = new Map<string, Simulator>();
    allSims.forEach((element) => {
      const latestSim = latest.get(element.id);
      if (latestSim) {
        const latestVersion = latestSim.version;
        const currentVersion = element.version;
        if (currentVersion > latestVersion) {
          latest.set(element.id, element);
        }
      } else {
        latest.set(element.id, element);
      }
    });
    const results = Array.from(latest.values());
    if (id) {
      return results.filter((value) => value.id === id);
    } else {
      return results;
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get the versions of a simulator',
    description:
      'Get a list of the specifications of each version of a simulator',
  })
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
  @ApiOperation({
    summary: 'Get a version of a simulator',
    description: 'Get the specifications of a version of a simulator',
  })
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
        throw new NotFoundException(
          `Simulator with id ${id} and version ${version} was not found`
        );
      } else {
        throw new NotFoundException(`Simulator with id ${id} was not found`);
      }
    }

    return res;
  }

  @UseGuards(JwtGuard, PermissionsGuard)
  @permissions('write:Simulators')
  @ApiOAuth2([])
  @Post()
  @ApiOperation({
    summary: 'Add a version of a simulator to the database',
    description:
      'Add the specifications of a version of a simulator to the database.',
  })
  @ApiBody({
    type: Simulator,
  })
  @ApiCreatedResponse({ description: 'Simulator Created', type: Simulator })
  @ApiUnauthorizedResponse({
    type: ErrorResponseDocument,
    description: 'Invalid Authorization Provided',
  })
  @ApiForbiddenResponse({
    type: ErrorResponseDocument,
    description: 'No permission to edit simulator',
  })
  @ApiBadRequestResponse({
    type: ErrorResponseDocument,
    description: 'Request body does not match schema',
  })
  @ApiConflictResponse({
    type: ErrorResponseDocument,
    description: 'Conflict with existing entry',
  })
  async create(@Body() doc: Simulator): Promise<Simulator> {
    return this.service.new(doc);
  }

  @Post('validate')
  @ApiOperation({
    summary: 'Validate the specification of a simulator',
    description:
      'Returns 204 (No Content) for a correct specification, or a 400 (Bad Input) for an incorrect specification.',
  })
  @ApiBody({
    type: Simulator,
  })
  @ApiBadRequestResponse({ type: ErrorResponseDocument })
  @ApiNoContentResponse({ description: 'No Content' })
  @HttpCode(204)
  async validateSimulator(@Body() doc: Simulator) {
    await this.service.validate(doc);
    return;
  }

  @permissions('write:Simulators')
  @UseGuards(JwtGuard, PermissionsGuard)
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
    description: 'Invalid Authorization Provided',
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
  @ApiOperation({
    summary: 'Update a version of a simulator',
    description: 'Update the specifications of a version of a simulator.',
  })
  async update(
    @Body() doc: Simulator,
    @Param('id') id: string,
    @Param('version') version: string
  ) {
    return this.service.replace(id, version, doc).then((res) => res);
  }

  @permissions('delete:Simulators')
  @UseGuards(JwtGuard, PermissionsGuard)
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
    description: 'Invalid Authorization Provided',
  })
  @ApiForbiddenResponse({
    type: ErrorResponseDocument,
    description: 'No permission to edit simulator',
  })
  @Delete(':id/:version')
  @ApiOperation({
    summary: 'Delete a version of a simulator',
    description: 'Delete the specifications of a version of a simulator.',
  })
  async deleteSimulatorVersion(
    @Param('id') id: string,
    @Param('version') version: string
  ) {
    return this.service.deleteOne(id, version);
  }

  @permissions('delete:Simulators')
  @UseGuards(JwtGuard, PermissionsGuard)
  @ApiOAuth2([])
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
  })
  @ApiNoContentResponse({
    description: 'Simulator Deleted',
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDocument,
    description: 'No such simulator',
  })
  @ApiUnauthorizedResponse({
    type: ErrorResponseDocument,
    description: 'Invalid Authorization Provided',
  })
  @ApiForbiddenResponse({
    type: ErrorResponseDocument,
    description: 'No permission to delete simulator',
  })
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete all versions of a simulator',
    description: 'Delete the specifications of  a simulator.',
  })
  @HttpCode(204)
  async deleteSimulator(@Param('id') id: string) {
    return this.service.deleteMany(id);
  }

  // No permissions, must be admin
  @UseGuards(JwtGuard, AdminGuard)
  @ApiOAuth2([])
  @ApiNoContentResponse({
    description: 'Simulators Deleted',
  })
  @ApiUnauthorizedResponse({
    type: ErrorResponseDocument,
    description: 'Invalid Authorization Provided',
  })
  @ApiForbiddenResponse({
    type: ErrorResponseDocument,
    description: 'No permission to delete data',
  })
  @Delete()
  @ApiOperation({
    summary: 'Delete all simulators',
    description: 'Clear the database. Use with extreme caution',
  })
  @HttpCode(204)
  async deleteAll() {
    return this.service.deleteAll();
  }
}
