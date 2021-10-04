import { ApiProperty, ApiResponseProperty, OmitType } from '@nestjs/swagger';
import { File as IFile } from '@biosimulations/datamodel/common';

export class ProjectFile implements IFile {
  @ApiProperty({})
  public id: string;

  @ApiProperty({
    description: 'File name',
    type: String,
    example: 'file.txt',
  })
  public name: string;

  @ApiProperty({
    description: 'Associated SimulationRun ID',
    type: String,
    example: '609aeb11d70ea3752d097015',
  })
  public simulationRun: string;

  @ApiProperty({
    description: 'File size in bytes',
    type: Number,
    example: 1024,
  })
  public size: number;

  @ApiProperty({
    description: 'Format of the file',
    type: String,
    example: 'http://identifiers.org/combine.specifications/sed-ml',
  })
  public format: string;

  @ApiProperty({})
  public url: string;

  @ApiProperty({
    description: 'Path of the file in the simulation run',
    example: 'simulation-1.sedml',
  })
  public location: string;

  @ApiResponseProperty({})
  public created!: string;

  @ApiResponseProperty({})
  public updated!: string;

  public _id!: never;
  public _v!: never;
  public constructor(
    id: string,
    name: string,
    simulationRun: string,
    location: string,
    size: number,
    format: string,
    url: string,
    created: string,
    updated: string,
  ) {
    this.id = id;
    this.name = name;
    this.simulationRun = simulationRun;
    this.size = size;
    this.format = format;
    this.url = url;
    this.location = location;
    this.created = created;
    this.updated = updated;
  }
}
export class SubmitProjectFile extends OmitType(ProjectFile, [
  'created',
  'updated',
]) {}
