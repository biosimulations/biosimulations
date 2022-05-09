import { Funding as IFunding, Ontologies } from '@biosimulations/datamodel/common';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsUrl, ValidateNested } from 'class-validator';
import { FunderRegistryOntologyId } from '../common';

export class Funding implements IFunding {
  @ValidateNested()
  @Type(() => FunderRegistryOntologyId)
  @ApiProperty({
    type: FunderRegistryOntologyId,
    example: {
      namespace: Ontologies.FunderRegistry,
      id: '100000001',
    },
  })
  public funder!: FunderRegistryOntologyId;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, nullable: true, required: false, default: null })
  public grant: string | null = null;

  @ApiProperty({
    type: String,
    format: 'url',
    nullable: true,
    required: false,
    default: null,
  })
  @IsOptional()
  @IsUrl({
    require_protocol: true,
    protocols: ['http', 'https'],
  })
  public url: string | null = null;
}
