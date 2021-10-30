import { ApiProperty } from '@nestjs/swagger';
import {
  Allow,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import {
  EdamOntologyId,
  FunderRegistryOntologyId,
  LinguistOntologyId,
  KisaoOntologyId,
  SboOntologyId,
  SioOntologyId,
  SpdxOntologyId,
} from './ontologyId.dto';

export class EdamTerm extends EdamOntologyId {
  @ApiProperty({ type: String })
  public name!: string;

  @ApiProperty({ type: String, nullable: true })
  public description: string | null = null;

  @ApiProperty({ type: String, format: 'url' })
  public iri!: string;

  @ApiProperty({ type: String, format: 'url' })
  public url!: string;

  @ApiProperty({ type: String, format: 'url' })
  public moreInfoUrl: string | null = null;

  @ApiProperty({
    description: 'Identifiers of parent terms',
    type: [String],
  })
  public parents!: string[];

  @ApiProperty({
    description: 'Identifiers of child terms',
    type: [String],
  })
  public children!: string[];
}

export class FunderRegistryTerm extends FunderRegistryOntologyId {
  @ApiProperty({ type: String })
  public name!: string;

  @ApiProperty({ type: typeof null, nullable: true })
  public description!: null;

  @ApiProperty({ type: typeof null, nullable: true })
  public iri!: null;

  @ApiProperty({ type: String })
  public url!: string;

  @ApiProperty({ type: typeof null, nullable: true })
  public moreInfoUrl!: null;

  @ApiProperty({
    description: 'Identifiers of parent terms',
    type: [String],
  })
  public parents!: string[];

  @ApiProperty({
    description: 'Identifiers of child terms',
    type: [String],
  })
  public children!: string[];
}

export class LinguistTerm extends LinguistOntologyId {
  @ApiProperty({ type: typeof null, nullable: true })
  public name!: null;

  @ApiProperty({ type: typeof null, nullable: true })
  public description!: null;

  @ApiProperty({ type: typeof null, nullable: true })
  public iri!: null;

  @ApiProperty({ type: typeof null, nullable: true })
  public url!: null;

  @ApiProperty({ type: typeof null, nullable: true })
  public moreInfoUrl!: null;

  @ApiProperty({
    description: 'Identifiers of parent terms',
    type: [String],
  })
  public parents!: string[];

  @ApiProperty({
    description: 'Identifiers of child terms',
    type: [String],
  })
  public children!: string[];
}

export class KisaoTerm extends KisaoOntologyId {
  @ApiProperty({ type: String })
  public name!: string;

  @ApiProperty({ type: String })
  public description: string | null = null;

  @ApiProperty({ type: String, format: 'url' })
  public iri!: string;

  @ApiProperty({ type: String, format: 'url' })
  public url!: string;

  @ApiProperty({ type: String, format: 'url' })
  public moreInfoUrl: string | null = null;

  @ApiProperty({
    description: 'Identifiers of parent terms',
    type: [String],
  })
  public parents!: string[];

  @ApiProperty({
    description: 'Identifiers of child terms',
    type: [String],
  })
  public children!: string[];
}

export class SboTerm extends SboOntologyId {
  @ApiProperty({ type: String })
  public name!: string;

  @ApiProperty({ type: String })
  public description: string | null = null;

  @ApiProperty({ type: String, format: 'url' })
  public iri!: string;

  @ApiProperty({ type: String, format: 'url' })
  public url!: string;

  @ApiProperty({ type: String, format: 'url' })
  public moreInfoUrl: string | null = null;

  @ApiProperty({
    description: 'Identifiers of parent terms',
    type: [String],
  })
  public parents!: string[];

  @ApiProperty({
    description: 'Identifiers of child terms',
    type: [String],
  })
  public children!: string[];
}

export class SioTerm extends SioOntologyId {
  @ApiProperty({ type: String })
  public name!: string;

  @ApiProperty({ type: String })
  public description: string | null = null;

  @ApiProperty({ type: String, format: 'url' })
  public iri!: string;

  @ApiProperty({ type: String, format: 'url' })
  public url!: string;

  @ApiProperty({ type: String, format: 'url' })
  public moreInfoUrl: string | null = null;

  @ApiProperty({
    description: 'Identifiers of parent terms',
    type: [String],
  })
  public parents!: string[];

  @ApiProperty({
    description: 'Identifiers of child terms',
    type: [String],
  })
  public children!: string[];
}

export class SpdxTerm extends SpdxOntologyId {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String })
  public name!: string;

  @Allow()
  @ApiProperty({ type: typeof null, nullable: true })
  public description!: null;

  @Allow()
  @ApiProperty({ type: typeof null, nullable: true })
  public iri!: null;

  @IsUrl({
    require_protocol: true,
    protocols: ['http', 'https'],
  })
  @ApiProperty({ type: String, format: 'url' })
  public url!: string;

  @IsUrl({
    require_protocol: true,
    protocols: ['http', 'https'],
  })
  @IsOptional()
  @ApiProperty({ type: String, format: 'url' })
  public moreInfoUrl: string | null = null;

  @ApiProperty({
    description: 'Identifiers of parent terms',
    type: [String],
  })
  public parents!: string[];

  @ApiProperty({
    description: 'Identifiers of child terms',
    type: [String],
  })
  public children!: string[];
}
