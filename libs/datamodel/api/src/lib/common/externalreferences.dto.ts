import { ExternalReferences as IExternalReferences } from '@biosimulations/datamodel/common';
import { Identifier } from './ontology.dto';
import { Citation } from './citation';
import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ExternalReferences implements IExternalReferences {
  @ValidateNested({ each: true })
  @Type(() => Identifier)
  @ApiProperty({ type: [Identifier] })
  public identifiers!: Identifier[];

  @ValidateNested({ each: true })
  @Type(() => Citation)
  @ApiProperty({ type: [Citation] })
  public citations!: Citation[];
}
