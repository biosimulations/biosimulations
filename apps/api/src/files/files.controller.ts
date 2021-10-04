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
import { ApiTags } from '@nestjs/swagger';
import { FileModel } from './files.model';
import { FilesService } from './files.service';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  private logger = new Logger(FilesController.name);
  public constructor(private service: FilesService) {}

  @Get()
  @permissions('read:Files')
  public getFiles() {}

  @Get(':simId')
  public async getSimulationFiles(
    @Param('simId') simId: string,
  ): Promise<ProjectFile[]> {
    const files = await this.service.getSimulationFiles(simId);
    return files.map((file) => this.createReturnFile(file));
  }

  @Get(':simId/:fileId')
  public async getFile(
    @Param('simId') simId: string,
    @Param('fileId') fileId: string,
  ): Promise<ProjectFile> {
    const id = simId + '/' + fileId;
    const file = await this.service.getFile(id);
    if (!file) {
      throw new NotFoundException('File not found');
    }
    return this.createReturnFile(file);
  }

  @Post()
  @permissions('write:Files')
  public async createFiles(@Body() files: SubmitProjectFile[]) {
    await this.service.createFiles(files);
  }

  //@Post(':simId')
  @permissions('write:Files')
  public createSimulationFiles(@Param() simId: string, @Body() files: any[]) {}

  //@Post(':simId/:fileId')
  @permissions('write:Files')
  public createFile(simId: string, fileId: string, file: any) {}

  //@Delete()
  @permissions('delete:Files')
  public async deleteAllFiles(@Param('fileId') fileId: string) {}

  //@Delete(':simId')
  @permissions('delete:Files')
  public async deleteSimulationFile(@Param('fileId') fileId: string) {}

  //@Delete(':simId/:FileId')
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
      file.url,
      file.created,
      file.updated,
    );
  }
}
