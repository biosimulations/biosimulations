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
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { AdminGuard } from '@biosimulations/auth/nest';
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
} from '@nestjs/swagger';
import { Simulator } from '@biosimulations/simulators/api-models';
import { SimulatorsService } from './simulators.service';

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
  @ApiNotFoundResponse({ description: 'Not Found' })
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
  @ApiQuery({
    name: 'version',
    required: false,
    type: String,
  })
  @ApiOkResponse({ type: [Simulator] })
  @ApiNotFoundResponse()
  async getSimulator(
    @Param('id') id: string,
    @Query('version') version: string
  ) {
    let res;
    if (!version) {
      return this.getSimulatorById(id);
    } else {
      return [this.getSimulatorByVersion(id, version)];
    }
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
  @ApiNotFoundResponse()
  async getSimulatorVersion(
    @Param('id') id: string,
    @Param('version') version: string
  ): Promise<Simulator> {
    return this.getSimulatorByVersion(id, version);
  }
  private async getSimulatorById(id: string) {
    const res = await this.service.findById(id);
    if (!res?.length) {
      throw new NotFoundException();
    }
    return res;
  }
  private async getSimulatorByVersion(id: string, version: string) {
    const res = await this.service.findByVersion(id, version);
    if (!res) {
      throw new NotFoundException();
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
  @ApiUnauthorizedResponse({})
  @ApiForbiddenResponse({})
  async create(@Body() doc: Simulator): Promise<Simulator[]> {
    return this.service.new(doc);
  }
  @Put(':id/:version')
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
    description: 'No such simulator',
  })
  @ApiUnauthorizedResponse({ description: 'No permission to edit simulators' })
  @ApiForbiddenResponse({
    description: 'No permission to edit simulator',
  })
  @ApiBadRequestResponse({ description: 'Request body does not match schema' })
  async update(
    @Body() doc: Simulator,
    @Param('id') id: string,
    @Param('version') version: string
  ) {
    return this.service
      .replace(id, version, doc)
      .then((res) => res)
      .catch((err) => {
        throw new BadRequestException({
          statusCode: '400',
          message: 'The input did not match the schema',
          details: err.errors,
        });
      });
  }
}
