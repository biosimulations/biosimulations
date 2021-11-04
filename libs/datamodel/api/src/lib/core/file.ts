import { ApiProperty, ApiResponseProperty, OmitType } from '@nestjs/swagger';
import { File as IFile } from '@biosimulations/datamodel/common';
import { IsString, IsPositive, IsInt, IsBoolean, IsUrl, IsMongoId, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ProjectFile implements IFile {
  @ApiProperty({
    type: String,
    description: 'Id of the file',
  })
  @IsNotEmpty()
  @IsString()
  public id: string;

  @ApiProperty({
    description: 'Name of the file',
    type: String,
    example: 'file.txt',
  })
  @IsNotEmpty()
  @IsString()
  public name: string;

  @ApiProperty({
    description: 'Id of the associated simulation run',
    type: String,
    example: '609aeb11d70ea3752d097015',
  })
  @IsMongoId()
  @IsString()
  public simulationRun: string;

  @ApiProperty({
    description: 'Size of the file in bytes',
    type: Number,
    example: 1024,
  })
  @IsPositive()
  @IsInt()
  public size: number;

  @ApiProperty({
    description: 'Format of the file',
    type: String,
    example: 'http://identifiers.org/combine.specifications/sed-ml',
  })
  @IsNotEmpty()
  @IsString()
  public format: string;

  @ApiProperty({
    description: 'Whether the file is a primary file for the project',
    type: Boolean,
  })
  @IsBoolean()
  public master: boolean;

  @ApiProperty({
    type: String,
    description: 'URL where the file can be retrieved',
    example: 'https://files.biosimulations.org/s3/simulations/aaaaaaaaaaaaaaaaaaaaaaaa/contents/model.xml',
  })
  @IsUrl({
    require_protocol: true,
    protocols: ['http', 'https'],
  })
  public url: string;

  @ApiProperty({
    description: 'Path of the file in the simulation run',
    example: 'simulation-1.sedml',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  public location: string;

  @ApiResponseProperty({
    type: String,
    format: 'date-time',
    // description: 'Timestamp when the file was created',
  })
  public created!: string;

  @ApiResponseProperty({
    type: String,
    format: 'date-time',
    // description: 'Timestamp when the file was lasted updated',
  })
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
    master: boolean,
    url: string,
    created: string,
    updated: string,
  ) {
    this.id = id;
    this.name = name;
    this.simulationRun = simulationRun;
    this.size = size;
    this.format = format;
    this.master = master;
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

export class SubmitProjectFileInput {
  @ValidateNested()
  @Type(() => SubmitProjectFile)
  files!: SubmitProjectFile[];
}
