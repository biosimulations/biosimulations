import { permissions } from '@biosimulations/auth/nest';
import {
  ProjectFile,
  ProjectFileInput,
  ProjectFileInputsContainer,
} from '@biosimulations/datamodel/api';
import {
  Controller,
  Post,
  Get,
  Body,
  Logger,
  Param,
  NotFoundException,
  HttpCode,
  // Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiPayloadTooLargeResponse,
  ApiNoContentResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { FileModel } from './files.model';
import { FilesService } from './files.service';
import { ErrorResponseDocument } from '@biosimulations/datamodel/api';
import { scopes } from '@biosimulations/config/common';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  private logger = new Logger(FilesController.name);
  public constructor(private service: FilesService) {}

  /*
  @Get()
  @ApiOperation({
    summary: '',
    description: '',
  })
  @ApiUnauthorizedResponse({
    type: ErrorResponseDocument,
    description: 'A valid authorization was not provided',
  })
  @ApiForbiddenResponse({
    type: ErrorResponseDocument,
    description: 'This account does not have permission to get metadata about all files',
  })
  @permissions(scopes.files.read.id)
  public getFiles() {}
  */

  @Get(':runId')
  @ApiOperation({
    summary: 'Get the files of a simulation run',
    description:
      'Get a list of metadata about each file (contents of the COMBINE/OMEX archive) of a simulation run',
  })
  @ApiParam({
    name: 'runId',
    description: 'Id of the simulation run',
    required: true,
    type: String,
    schema: {
      pattern: '^[a-f\\d]{24}$',
    },
  })
  @ApiOkResponse({
    description: 'Metadata about the files was successfully retrieved',
    type: [ProjectFile],
  })
  public async getSimulationRunFiles(
    @Param('runId') runId: string,
  ): Promise<ProjectFile[]> {
    const files = await this.service.getSimulationRunFiles(runId);
    return files.map((file) => this.createReturnFile(file));
  }

  @Get(':runId/:fileLocation')
  @ApiOperation({
    summary: 'Get metadata about a file',
    description:
      'Get metadata about a file (location in the COMBINE/OMEX archive) of a simulation run',
  })
  @ApiParam({
    name: 'runId',
    description: 'Id of the simulation run',
    required: true,
    type: String,
    schema: {
      pattern: '^[a-f\\d]{24}$',
    },
  })
  @ApiParam({
    name: 'fileLocation',
    description:
      'Location of the file within the COMBINE/OMEX archive for the simulation run',
    required: true,
    type: String,
  })
  @ApiOkResponse({
    description: 'Metadata about the file was successfully retrieved',
    type: ProjectFile,
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDocument,
    description: 'No file has the requested run id and file location',
  })
  public async getFile(
    @Param('runId') runId: string,
    @Param('fileLocation') fileLocation: string,
  ): Promise<ProjectFile> {
    const file = await this.service.getFile(runId, fileLocation);
    if (!file) {
      throw new NotFoundException(
        `A file could not found for simulation run '${runId}' and location '${fileLocation}'.`,
      );
    }
    return this.createReturnFile(file);
  }

  @Post()
  @ApiOperation({
    summary: 'Save metadata about files',
    description:
      'Save metadata about each file (contents of the COMBINE/OMEX archive) for a simulation run to the database',
  })
  @ApiBody({
    description: 'Metadata about the files for the simulation run',
    type: ProjectFileInputsContainer,
  })
  @ApiPayloadTooLargeResponse({
    type: ErrorResponseDocument,
    description:
      'The payload is too large. The payload must be less than the server limit.',
  })
  @ApiUnauthorizedResponse({
    type: ErrorResponseDocument,
    description: 'A valid authorization was not provided',
  })
  @ApiForbiddenResponse({
    type: ErrorResponseDocument,
    description:
      'This account does not have permission to write metadata about all files',
  })
  @permissions(scopes.files.create.id)
  @ApiCreatedResponse({
    description:
      'The metadata for the files for the simulation were successfully saved to the database',
    type: [ProjectFileInput],
  })
  public async createFiles(
    @Body() files: ProjectFileInputsContainer,
  ): Promise<void> {
    await this.service.createFiles(files.files);
  }

  //@Post(':runId')
  @ApiParam({
    name: 'runId',
    description: 'Id of the simulation run',
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
    description:
      'This account does not have permission to write metadata about all files',
  })
  @permissions(scopes.files.create.id)
  public async createSimulationFiles(
    @Param('runId') runId: string,
    @Body() files: any[],
  ): Promise<void> {}

  //@Post(':runId/:fileLocation')
  @ApiParam({
    name: 'runId',
    description: 'Id of the simulation run',
    required: true,
    type: String,
    schema: {
      pattern: '^[a-f\\d]{24}$',
    },
  })
  @ApiParam({
    name: 'fileLocation',
    description:
      'Location of the file within the COMBINE/OMEX archive for the simulation run',
    required: true,
    type: String,
  })
  @ApiUnauthorizedResponse({
    type: ErrorResponseDocument,
    description: 'A valid authorization was not provided',
  })
  @ApiForbiddenResponse({
    type: ErrorResponseDocument,
    description:
      'This account does not have permission to write metadata about all files',
  })
  @permissions(scopes.files.create.id)
  public async createFile(
    @Param('runId') runId: string,
    fileLocation: string,
    file: any,
  ): Promise<void> {}

  @ApiOperation({
    summary: 'Delete all files for a simulation run',
    description: 'Delete all files for a simulation run',
  })
  // @Delete(':runId')
  @ApiParam({
    name: 'runId',
    description: 'Id of the simulation run',
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
    description: 'This account does not have permission to delete files',
  })
  @permissions(scopes.files.delete.id)
  @ApiNoContentResponse({
    description: 'The files for the simulation run were successfully deleted',
  })
  @HttpCode(204)
  public async deleteSimulationRunFiles(
    @Param('runId') runId: string,
  ): Promise<void> {
    return this.service.deleteSimulationRunFiles(runId);
  }

  @ApiOperation({
    summary: 'Delete a file',
    description: 'Delete a file',
  })
  // @Delete(':runId/:fileLocation')
  @ApiParam({
    name: 'runId',
    description: 'Id of the simulation run',
    required: true,
    type: String,
    schema: {
      pattern: '^[a-f\\d]{24}$',
    },
  })
  @ApiParam({
    name: 'fileLocation',
    description:
      'Location of the file within the COMBINE/OMEX archive for the simulation run',
    required: true,
    type: String,
  })
  @ApiUnauthorizedResponse({
    type: ErrorResponseDocument,
    description: 'A valid authorization was not provided',
  })
  @ApiForbiddenResponse({
    type: ErrorResponseDocument,
    description: 'This account does not have permission to delete files',
  })
  @permissions(scopes.files.delete.id)
  @ApiNotFoundResponse({
    type: ErrorResponseDocument,
    description: 'No file has the requested run id and file location',
  })
  @ApiNoContentResponse({
    description: 'The file was successfully deleted',
  })
  @HttpCode(204)
  public async deleteFile(
    @Param('runId') runId: string,
    @Param('fileLocation') fileLocation: string,
  ): Promise<void> {
    this.deleteFile(runId, fileLocation);
  }

  private createReturnFile(file: FileModel): ProjectFile {
    return new ProjectFile(
      file.id,
      file.name,
      file.simulationRun,
      file.location,
      file.size,
      file.format,
      file.master,
      file.url,
      file.created,
      file.updated,
    );
  }
}
