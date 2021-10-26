import { Funding as IFunding } from '@biosimulations/datamodel/common';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsUrl, ValidateNested } from 'class-validator';
import { FunderRegistryOntologyId } from './ontologyId.dto';

export class Funding implements IFunding {
  @ValidateNested()
  @Type(() => FunderRegistryOntologyId)
  @ApiProperty({ type: FunderRegistryOntologyId })
  public funder!: FunderRegistryOntologyId;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, nullable: true, required: false, default: null })
  public grant!: string | null;

  @ApiProperty({
    type: String,
    format: 'url',
    nullable: true,
    required: false,
    default: null,
  })
  @IsOptional()
  @IsUrl({ require_protocol: true })
  public url!: string | null;
}
