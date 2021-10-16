import { permissions } from '@biosimulations/auth/nest';
import { ProjectFile, SubmitProjectFile } from '@biosimulations/datamodel/api';
import {
  Controller,
  Post,
  Get,
  Body,
  Logger,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiOkResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiUnauthorizedResponse, ApiForbiddenResponse } from '@nestjs/swagger';
import { FileModel } from './files.model';
import { FilesService } from './files.service';
import { ErrorResponseDocument } from '@biosimulations/datamodel/api';

@ApiTags('Files (contents of COMBINE/OMEX archive) of simulation runs')
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
  @permissions('read:Files')
  @ApiUnauthorizedResponse({
    type: ErrorResponseDocument,
    description: 'A valid authorization was not provided',
  })
  @ApiForbiddenResponse({
    type: ErrorResponseDocument,
    description: 'This account does not have permission to get metadata about all files',
  })
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
  })
  @ApiOkResponse({
    description: 'Metadata about the files was successfully retrieved',
    type: [ProjectFile],
  })
  public async getSimulationFiles(
    @Param('runId') runId: string,
  ): Promise<ProjectFile[]> {
    const files = await this.service.getSimulationFiles(runId);
    return files.map((file) => this.createReturnFile(file));
  }

  @Get(':runId/:fileLocation')
  @ApiOperation({
    summary: 'Get metadata about a file of a simulation run',
    description: 'Get metadata about a file (location in the COMBINE/OMEX archive) of a simulation run',
  })
  @ApiParam({
    name: 'runId',
    description: 'Id of the simulation run',
    required: true,
    type: String,
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
    const id = runId + '/' + fileLocation;
    const file = await this.service.getFile(id);
    if (!file) {
      throw new NotFoundException('File not found');
    }
    return this.createReturnFile(file);
  }

  @Post()
  @ApiOperation({
    summary: 'Save metadata about the files for a simulation run to the database',
    description: 'Save metadata about each file (contents of the COMBINE/OMEX archive) for a simulation run to the database',
  })
  @ApiBody({
    description: 'Metadata about the files for the simulation run',
    type: [SubmitProjectFile],
  })
  @permissions('write:Files')
  @ApiUnauthorizedResponse({
    type: ErrorResponseDocument,
    description: 'A valid authorization was not provided',
  })
  @ApiForbiddenResponse({
    type: ErrorResponseDocument,
    description: 'This account does not have permission to save metadata about files',
  })
  @ApiCreatedResponse({
    description: 'The metadata for the files for the simulation were successfully saved to the database',
    type: [SubmitProjectFile],
  })
  public async createFiles(@Body() files: SubmitProjectFile[]) {
    await this.service.createFiles(files);
  }

  //@Post(':runId')
  @permissions('write:Files')
  public createSimulationFiles(@Param() runId: string, @Body() files: any[]) {}

  //@Post(':runId/:fileId')
  @permissions('write:Files')
  public createFile(runId: string, fileId: string, file: any) {}

  //@Delete()
  @permissions('delete:Files')
  public async deleteAllFiles(@Param('fileId') fileId: string) {}

  //@Delete(':runId')
  @permissions('delete:Files')
  public async deleteSimulationFile(@Param('fileId') fileId: string) {}

  //@Delete(':runId/:fileId')
  @permissions('delete:Files')
  public async deleteFile(@Param('fileId') fileId: string) {}
  private createReturnFile(file: FileModel) {
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
