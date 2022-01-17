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
  HttpStatus,
} from '@nestjs/common';

import {
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
  ApiPayloadTooLargeResponse,
} from '@nestjs/swagger';
import { Simulator } from '@biosimulations/ontology/datamodel';
import { SimulatorsService } from './simulators.service';
import { ErrorResponseDocument } from '@biosimulations/datamodel/api';
import compareVersions from 'compare-versions';
import compareVersionsWithAdditionalPoints from 'tiny-version-compare';
import { scopes } from '@biosimulations/auth/common';

@ApiTags('Simulators')
@Controller('simulators')
export class SimulatorsController {
  public constructor(private service: SimulatorsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all simulation tools and all of their versions',
    description:
      'Get a list of the specifications of each available version of each simulation tool.',
  })
  @ApiQuery({
    name: 'includeTests',
    description:
      'Whether to include the results of the validation tests of the simulation tool (`Simulator.biosimulators.validationTests`) or exclude this attribute.',
    required: false,
    type: Boolean,
  })
  @ApiOkResponse({
    description:
      'The specifications of the simulation tools were successfully retrieved',
    type: [Simulator],
  })
  public getSimulators(@Query('includeTests') includeTests = 'false') {
    const includeBool = ['true', '1'].includes(includeTests.toLowerCase());

    return this.service.findAll(includeBool);
  }

  @Get('latest')
  @ApiOkResponse({
    description:
      'The requested simulation tool specifications were successfully retrieved',
    type: [Simulator],
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDocument,
    description: 'No simulation tool has the requested id',
  })
  @ApiOperation({
    summary:
      'Get the latest version of each simulation tool, or of a particular simulation tool',
    description:
      'Get a list of the specifications of the latest version of each simulation tool, ' +
      'or a list with one element which is the specifications of the latest version of a particular simulation tool.',
  })
  @ApiQuery({
    name: 'id',
    description: 'Id of the simulation tool',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'includeTests',
    description:
      'Whether to include the results of the validation tests of the simulation tool (`Simulator.biosimulators.validationTests`) or exclude this attribute.',
    required: false,
    type: Boolean,
  })
  public async getLatestSimulators(
    @Query('id') id?: string,
    @Query('includeTests') includeTests = 'false',
  ): Promise<Simulator[]> {
    const includeBool = ['true', '1'].includes(includeTests.toLowerCase());
    const allSims = await this.service.findAll(includeBool);
    const latest = new Map<string, Simulator>();
    allSims.forEach((element) => {
      const latestSim = latest.get(element.id) as Simulator;
      if (latestSim) {
        if (this.compareSimulatorVersions(latestSim, element) === -1) {
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
    summary: 'Get the versions of a simulation tool',
    description:
      'Get a list of the specifications of each version of a simulation tool',
  })
  @ApiParam({
    name: 'id',
    description: 'Id of the simulation tool',
    required: true,
    type: String,
  })
  @ApiQuery({
    name: 'includeTests',
    description:
      'Whether to include the results of the validation tests of the simulation tool (`Simulator.biosimulators.validationTests`) or exclude this attribute.',
    required: false,
    type: Boolean,
  })
  @ApiOkResponse({
    description:
      'The specifications of the requested simulation toool were successfully retrieved',
    type: [Simulator],
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDocument,
    description: 'No simulation tool has the requested id',
  })
  public async getSimulator(
    @Param('id') id: string,
    @Query('includeTests') includeTests = 'false',
  ) {
    const includeBool = ['true', '1'].includes(includeTests.toLowerCase());
    return this.getSimulatorById(id, includeBool);
  }

  @Get(':id/:version')
  @ApiOperation({
    summary: 'Get a version of a simulation tool',
    description: 'Get the specifications of a version of a simulation tool',
  })
  @ApiParam({
    name: 'id',
    description: 'Id of the simulation tool',
    example: 'tellurium',
    required: true,
    type: String,
  })
  @ApiParam({
    name: 'version',
    description: 'Version of the simulation tool',
    example: '2.2.1',
    required: true,
    type: String,
  })
  @ApiQuery({
    name: 'includeTests',
    description:
      'Whether to include the results of the validation tests of the simulation tool (`Simulator.biosimulators.validationTests`) or exclude this attribute.',
    required: false,
    type: Boolean,
  })
  @ApiOkResponse({
    description:
      'The specifications of the requested version of the requested simulation tool were successfully retrieved',
    type: Simulator,
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDocument,
    description: 'No simulation tool has the requested id and version',
  })
  public async getSimulatorVersion(
    @Param('id') id: string,
    @Param('version') version: string,
    @Query('includeTests') includeTests = 'false',
  ): Promise<Simulator | null> {
    const includeTestBool = ['true', '1'].includes(includeTests.toLowerCase());
    return this.getSimulatorByVersion(id, version, includeTestBool);
  }

  @Post()
  @ApiOperation({
    summary: 'Add a version of a simulation tool to the database',
    description:
      'Add the specifications of a version of a simulation tool to the database.',
  })
  @ApiBody({
    description: 'Specifications of the version of the simulation tool',
    type: Simulator,
  })
  @ApiPayloadTooLargeResponse({
    type: ErrorResponseDocument,
    description:
      'The submitted simulator specifications is too large. Specifications must be less than 16 MB.',
  })
  @ApiCreatedResponse({
    description:
      'The version of the simulation tool was successfully saved to the database',
    type: Simulator,
  })
  @ApiBadRequestResponse({
    type: ErrorResponseDocument,
    description:
      'The specifications of the simulation tool are invalid. See https://docs.biosimulations.org/concepts/conventions/ and https://api.biosimulators.org for examples and documentation.',
  })
  @ApiConflictResponse({
    type: ErrorResponseDocument,
    description:
      'The version of the simulation tool could not be saved because the database already includes this version of this tool. Please use the `PUT` method to modify versions of simulation tools. Please see https://docs.biosimulations.org/concepts/conventions/ and https://api.biosimulators.org for more information.',
  })
  @permissions(scopes.simulators.create.id)
  public async create(@Body() doc: Simulator): Promise<void> {
    await this.service.new(doc);
    return;
  }

  @Post('validate')
  @ApiOperation({
    summary: 'Validate the specification of a simulation tool',
    description:
      'Validate the specification of a version of a simulation tool. Returns 204 (No Content) for a correct specification, or a 400 (Bad Input) for an incorrect specification. 400 errors include diagnostic information which describe why the specification is invalid.',
  })
  @ApiBody({
    description: 'Specifications of the version of the simulation tool',
    type: Simulator,
  })
  @ApiPayloadTooLargeResponse({
    type: ErrorResponseDocument,
    description:
      'The submitted simulator specifications is too large. Specifications must be less than 16 MB.',
  })
  @ApiBadRequestResponse({
    type: ErrorResponseDocument,
    description:
      'The specifications of the simulation tool are invalid. See https://docs.biosimulations.org/concepts/conventions/ and https://api.biosimulators.org for examples and documentation.',
  })
  @ApiNoContentResponse({
    description: 'The specifications of the simulation tool are valid',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  public async validateSimulator(@Body() doc: Simulator): Promise<void> {
    await this.service.validate(doc);
    return;
  }

  @ApiParam({
    name: 'id',
    description: 'Id of the simulation tool',
    required: true,
    type: String,
  })
  @ApiParam({
    name: 'version',
    description: 'Version of the simulation tool',
    required: true,
    type: String,
  })
  @ApiBody({
    description: 'Specifications of the simulation tool',
    type: Simulator,
  })
  @ApiPayloadTooLargeResponse({
    type: ErrorResponseDocument,
    description:
      'The submitted simulator specifications is too large. Specifications must be less than 16 MB.',
  })
  @ApiOkResponse({
    type: Simulator,
    description:
      'The specifications of the version of the simulation tool were successfully modified',
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDocument,
    description: 'No simulation tool has the requested id',
  })
  @ApiBadRequestResponse({
    type: ErrorResponseDocument,
    description:
      'The specifications of the simulation tool are invalid. See https://docs.biosimulations.org/concepts/conventions/ and https://api.biosimulators.org for examples and documentation.',
  })
  @permissions(scopes.simulators.update.id)
  @Put(':id/:version')
  @ApiOperation({
    summary: 'Update a version of a simulation tool',
    description: 'Update the specifications of a version of a simulation tool.',
  })
  public async update(
    @Body() doc: Simulator,
    @Param('id') id: string,
    @Param('version') version: string,
  ): Promise<Simulator> {
    return this.service.replace(id, version, doc).then((res) => res);
  }

  @UseGuards(JwtGuard, PermissionsGuard)
  @ApiOAuth2([])
  @ApiParam({
    name: 'id',
    description: 'Id of the simulation tool',
    required: true,
    type: String,
  })
  @ApiParam({
    name: 'version',
    description: 'Version of the simulation tool',
    required: true,
    type: String,
  })
  @ApiOkResponse({
    type: Simulator,
    description: 'The version of the simulation tool was successfully deleted',
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDocument,
    description: 'No simulation tool has the requested id',
  })
  @ApiUnauthorizedResponse({
    type: ErrorResponseDocument,
    description: 'A valid authorization was not provided',
  })
  @ApiForbiddenResponse({
    type: ErrorResponseDocument,
    description:
      'This account does not have permission to delete simulation tools',
  })
  @permissions(scopes.simulators.delete.id)
  @Delete(':id/:version')
  @ApiOperation({
    summary: 'Delete a version of a simulation tool',
    description: 'Delete the specifications of a version of a simulation tool.',
  })
  public async deleteSimulatorVersion(
    @Param('id') id: string,
    @Param('version') version: string,
  ) {
    return this.service.deleteOne(id, version);
  }

  @ApiParam({
    name: 'id',
    description: 'Id of the simulation tool',
    required: true,
    type: String,
  })
  @ApiNoContentResponse({
    description: 'The simulation tool was successfully deleted',
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDocument,
    description: 'No simulation tool has the requested id',
  })
  @permissions(scopes.simulators.delete.id)
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete all versions of a simulation tool',
    description:
      'Delete the specifications of all versions of a simulation tool.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteSimulator(@Param('id') id: string): Promise<void> {
    return this.service.deleteMany(id);
  }

  @permissions(scopes.simulators.deleteAll.id)
  @ApiNoContentResponse({
    description: 'All simulation tools were successfully deleted',
  })
  @Delete()
  @ApiOperation({
    summary: 'Delete all simulation tools',
    description: 'Clear the database. Use with extreme caution',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteAll(): Promise<void> {
    return this.service.deleteAll();
  }

  private async getSimulatorById(id: string, includeTests: boolean) {
    const res = await this.service
      .findById(id, includeTests)
      .catch((_) => null);
    if (!res?.length) {
      throw new NotFoundException(`Simulator with id '${id}' was not found`);
    }
    return res;
  }

  private async getSimulatorByVersion(
    id: string,
    version: string,
    includeTests: boolean,
  ): Promise<Simulator | null> {
    const res = await this.service.findByVersion(id, version, includeTests);
    if (!res) {
      if (version) {
        throw new NotFoundException(
          `Simulator with id '${id}' and version '${version}' was not found`,
        );
      } else {
        throw new NotFoundException(`Simulator with id '${id}' was not found`);
      }
    }

    return res;
  }
  private compareSimulatorVersions(a: Simulator, b: Simulator): number {
    const aVersion = a.version.replace(/-/g, '.');
    const bVersion = b.version.replace(/-/g, '.');
    try {
      return compareVersions(aVersion, bVersion);
    } catch {
      try {
        return compareVersionsWithAdditionalPoints(aVersion, bVersion);
      } catch {
        if (b.biosimulators.created > a.biosimulators.created) {
          return -1;
        } else if (b.biosimulators.created < a.biosimulators.created) {
          return 1;
        } else {
          return 0;
        }
      }
    }
  }
}
