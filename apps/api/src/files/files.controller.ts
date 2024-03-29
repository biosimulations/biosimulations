import { permissions } from '@biosimulations/auth/nest';
import { ProjectFile, ProjectFileInputsContainer, ProjectFileThumbnailInput } from '@biosimulations/datamodel/api';

import {
  Controller,
  Post,
  Get,
  Body,
  Logger,
  Param,
  NotFoundException,
  HttpCode,
  HttpStatus,
  Redirect,
  Query,
  Put,
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
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { FileModel } from './files.model';
import { FilesService } from './files.service';
import { ErrorResponseDocument } from '@biosimulations/datamodel/api';
import { scopes } from '@biosimulations/auth/common';

import { Thumbnail } from '@biosimulations/datamodel/common';

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
    description: 'Get a list of metadata about each file (contents of the COMBINE/OMEX archive) of a simulation run',
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
  public async getSimulationRunFiles(@Param('runId') runId: string): Promise<ProjectFile[]> {
    const files = await this.service.getSimulationRunFiles(runId);
    return files.map((file) => this.createReturnFile(file));
  }

  @Get(':runId/:fileLocation')
  @ApiOperation({
    summary: 'Get metadata about a file',
    description: 'Get metadata about a file (location in the COMBINE/OMEX archive) of a simulation run',
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
    description: 'Location of the file within the COMBINE/OMEX archive for the simulation run',
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

  @Put(':runId/:fileLocation/thumbnail')
  @ApiOperation({
    summary: 'Set the thumbnail for a file',
    description: 'Set resized thumbnails for a file location in the COMBINE/OMEX archive of a simulation run',
  })
  @ApiBody({
    description: 'URLs of thumbnails of a file',
    type: ProjectFileThumbnailInput,
  })
  @ApiCreatedResponse({
    description: 'URLs were successfully saved',
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDocument,
    description: 'No file has the requested run id and file location',
  })
  @HttpCode(HttpStatus.CREATED)
  @permissions(scopes.files.create.id)
  public async addThumbnailUrls(
    @Param('runId') runId: string,
    @Param('fileLocation') fileLocation: string,
    @Body() thumbnailUrls: ProjectFileThumbnailInput,
  ): Promise<void> {
    return this.service.addThumbnailUrls(runId, fileLocation, thumbnailUrls);
  }

  @Get(':runId/:fileLocation/download')
  @ApiOperation({
    summary: 'Download a file',
    description: 'Download a file (location in the COMBINE/OMEX archive) of a simulation run',
  })
  @ApiResponse({
    status: HttpStatus.MOVED_PERMANENTLY,
    description: 'Redirect to the file download URL',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The requested file could not be found',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The request successfully  downloaded the file (location in the COMBINE/OMEX archive) for the run',
  })
  @ApiQuery({
    name: 'thumbnail',
    description: 'The resized thumbnail version of the file to download',
    required: false,
    enum: Thumbnail,
  })
  @Redirect()
  public async downloadFile(
    @Param('runId') runId: string,
    @Param('fileLocation') fileLocation: string,
    @Query('thumbnail') thumbnail?: Thumbnail,
  ): Promise<{
    url: string;
    statusCode: number;
  }> {
    const file = await this.service.getFile(runId, fileLocation);
    if (!file) {
      throw new NotFoundException(
        `A file could not found for simulation run '${runId}' and location '${fileLocation}'.`,
      );
    }

    const url = file.url;

    //make sure to use optional chaining to prevent error if no thumbnails exist
    const thumbnailUrl = thumbnail ? file?.thumbnailUrls?.[thumbnail] : undefined;

    if (thumbnail && thumbnailUrl) {
      return {
        url: thumbnailUrl,
        statusCode: HttpStatus.MOVED_PERMANENTLY,
      };
    }

    return {
      url: url,
      statusCode: HttpStatus.MOVED_PERMANENTLY,
    };
  }

  @Post(':runId')
  @ApiOperation({
    summary: 'Save metadata about files',
    description:
      'Save metadata about each file (contents of the COMBINE/OMEX archive) for a simulation run to the database',
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
  @ApiBody({
    description: 'Metadata about the files for the simulation run',
    type: ProjectFileInputsContainer,
  })
  @ApiPayloadTooLargeResponse({
    type: ErrorResponseDocument,
    description: 'The payload is too large. The payload must be less than the server limit.',
  })
  @ApiUnauthorizedResponse({
    type: ErrorResponseDocument,
    description: 'A valid authorization was not provided',
  })
  @ApiForbiddenResponse({
    type: ErrorResponseDocument,
    description: 'This account does not have permission to write metadata about all files',
  })
  @permissions(scopes.files.create.id)
  @ApiCreatedResponse({
    description: 'The metadata for the files for the simulation were successfully saved to the database',
    type: [ProjectFile],
  })
  public async createFiles(
    @Param('runId') runId: string,
    @Body() files: ProjectFileInputsContainer,
  ): Promise<ProjectFile[]> {
    const returnFiles = await this.service.createFiles(runId, files.files);
    return returnFiles.map((file) => this.createReturnFile(file));
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
    description: 'This account does not have permission to write metadata about all files',
  })
  @permissions(scopes.files.create.id)
  public async createSimulationFiles(@Param('runId') runId: string, @Body() files: any[]): Promise<void> {}

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
    description: 'Location of the file within the COMBINE/OMEX archive for the simulation run',
    required: true,
    type: String,
  })
  @ApiUnauthorizedResponse({
    type: ErrorResponseDocument,
    description: 'A valid authorization was not provided',
  })
  @ApiForbiddenResponse({
    type: ErrorResponseDocument,
    description: 'This account does not have permission to write metadata about all files',
  })
  @permissions(scopes.files.create.id)
  public async createFile(@Param('runId') runId: string, fileLocation: string, file: any): Promise<void> {}

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
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteSimulationRunFiles(@Param('runId') runId: string): Promise<void> {
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
    description: 'Location of the file within the COMBINE/OMEX archive for the simulation run',
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
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteFile(@Param('runId') runId: string, @Param('fileLocation') fileLocation: string): Promise<void> {
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
      file.created.toISOString(),
      file.updated.toISOString(),
    );
  }
}
