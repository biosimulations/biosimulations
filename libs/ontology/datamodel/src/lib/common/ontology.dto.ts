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
import {
  EdamTerm as IEdamTerm,
  FunderRegistryTerm as IFunderRegistryTerm,
  KisaoTerm as IKisaoTerm,
  LinguistTerm as ILinguistTerm,
  SboTerm as ISboTerm,
  SioTerm as ISioTerm,
  SpdxTerm as ISpdxTerm,
  BiosimulationsFormatMetadata as IBiosimulationsFormatMetadata,
  BiosimulationsModelFormat as IBiosimulationsModelFormat,
} from '@biosimulations/datamodel/common';

export class BiosimulationsModelFormat implements IBiosimulationsModelFormat {
  @ApiProperty({
    description: "Simulation Experiment Description (SED) Markup Language URN for the term used in conjunction with simulation experiments. See http://sed-ml.org/urns.html for more information.",
    type: String,
  })
  public sedUrn!: string;

  @ApiProperty({
    description: "Whether BioSimulations provides validation for the format",
    type: String,
  })
  public validationAvailable!: boolean;

  @ApiProperty({
    description: "Whether BioSimulations provides introspection for the format",
    type: String,
  })
  public introspectionAvailable!: boolean;
}

export class BiosimulationsFormatMetadata implements IBiosimulationsFormatMetadata {
  @ApiProperty({
    description: "Acronym for the term",
    type: String,
    required: false,
  })
  public acronym?: string;

  @ApiProperty({
    description: "URIs for the term that BioSimulations recognizes inconjunction with manifests of COMBINE/OMEX archives. See https://combinearchive.org/ for more information.",
    type: String,
  })
  public omexManifestUris!: string[];

  @ApiProperty({
    description: "Additional metadata about terms that represent model formats (e.g., CellML, SBML)",
    type: BiosimulationsModelFormat,
    required: false,
  })
  public modelFormatMetadata?: BiosimulationsModelFormat;

  @ApiProperty({
    description: "BioSimulations icon for the term",
    type: String,
  })
  public icon!: string;
}

export class EdamTerm extends EdamOntologyId implements IEdamTerm {
  @ApiProperty({
    description: "Name of the term",
    type: String,
  })
  public name!: string;

  @ApiProperty({
    description: "Description of the term",
    type: String, 
    nullable: true
  })
  public description: string | null = null;

  @ApiProperty({
    description: 'Media types. Used by terms that represent file formats.',
    type: [String],
  })
  mediaTypes!: string[];

  @ApiProperty({
    description: 'File extensions. Used by terms that represent file formats.',
    type: [String],
  })
  fileExtensions!: string[];

  @ApiProperty({
    description: "IRI for the term",
    type: String,
    format: 'url'
  })
  public iri!: string;

  @ApiProperty({
    description: "URL with basic information about the term from an ontology browser such as OLS",
    type: String,
    format: 'url'
  })
  public url!: string;

  @ApiProperty({
    description: "URL for more information about the term",
    type: String,
    format: 'url',
    nullable: true,
  })
  public moreInfoUrl: string | null = null;

  @ApiProperty({
    description: 'Identifiers of the parents of the term',
    type: [String],
  })
  public parents!: string[];

  @ApiProperty({
    description: 'Identifiers of the children of the term',
    type: [String],
  })
  public children!: string[];

  @ApiProperty({
    description: 'Additional metadata about the term beyond the information organized into the EDAM ontology',
    type: BiosimulationsFormatMetadata,
  })
  public biosimulationsMetadata?: BiosimulationsFormatMetadata;
}

export class FunderRegistryTerm extends FunderRegistryOntologyId implements IFunderRegistryTerm {
  @ApiProperty({
    description: "Name of the term",
    type: String,
  })
  public name!: string;

  @ApiProperty({
    description: "Description of the term",
    type: typeof null,
    nullable: true
  })
  public description!: null;

  @ApiProperty({
    description: "IRI for the term",
    type: typeof null,
    nullable: true,
  })
  public iri!: null;

  @ApiProperty({
    description: "URL with basic information about the term from an ontology browser such as OLS",
    type: String,
    format: 'url'
  })
  public url!: string;

  @ApiProperty({
    description: "URL for more information about the term",
    type: String,
    format: 'url'
  })
  public moreInfoUrl!: null;

  @ApiProperty({
    description: 'Identifiers of the parents of the term',
    type: [String],
  })
  public parents!: string[];

  @ApiProperty({
    description: 'Identifiers of the children of the term',
    type: [String],
  })
  public children!: string[];
}

export class LinguistTerm extends LinguistOntologyId implements ILinguistTerm  {
  @ApiProperty({
    description: "Name of the term",
    type: typeof null,
    nullable: true
  })
  public name!: null;

  @ApiProperty({
    description: "Description of the term",
    type: typeof null,
    nullable: true
  })
  public description!: null;

  @ApiProperty({
    description: "IRI for the term",
    type: typeof null,
    nullable: true,
  })
  public iri!: null;

  @ApiProperty({
    description: "URL with basic information about the term from an ontology browser such as OLS",
    type: typeof null,
    nullable: true
  })
  public url!: null;

  @ApiProperty({
    description: "URL for more information about the term",
    type: String,
    format: 'url'
  })
  public moreInfoUrl!: null;

  @ApiProperty({
    description: 'Identifiers of the parents of the term',
    type: [String],
  })
  public parents!: string[];

  @ApiProperty({
    description: 'Identifiers of the children of the term',
    type: [String],
  })
  public children!: string[];
}

export class KisaoTerm extends KisaoOntologyId implements IKisaoTerm {
  @ApiProperty({
    description: "Name of the term",
    type: String,
  })
  public name!: string;

  @ApiProperty({
    description: "Description of the term",
    type: String, 
    nullable: true,
  })
  public description: string | null = null;

  @ApiProperty({
    description: "IRI for the term",
    type: String,
    format: 'url'
  })
  public iri!: string;

  @ApiProperty({
    description: "URL with basic information about the term from an ontology browser such as OLS",
    type: String,
    format: 'url'
  })
  public url!: string;

  @ApiProperty({
    description: "URL for more information about the term",
    type: String,
    format: 'url',
    nullable: true,
  })
  public moreInfoUrl: string | null = null;

  @ApiProperty({
    description: 'Identifiers of the parents of the term',
    type: [String],
  })
  public parents!: string[];

  @ApiProperty({
    description: 'Identifiers of the children of the term',
    type: [String],
  })
  public children!: string[];
}

export class SboTerm extends SboOntologyId implements ISboTerm {
  @ApiProperty({
    description: "Name of the term",
    type: String,
  })
  public name!: string;

  @ApiProperty({
    description: "Description of the term",
    type: String, 
    nullable: true,
  })
  public description: string | null = null;

  @ApiProperty({
    description: "IRI for the term",
    type: String,
    format: 'url'
  })
  public iri!: string;

  @ApiProperty({
    description: "URL with basic information about the term from an ontology browser such as OLS",
    type: String,
    format: 'url'
  })
  public url!: string;

  @ApiProperty({
    description: "URL for more information about the term",
    type: typeof null,
    nullable: true,
  })
  public moreInfoUrl!: null;

  @ApiProperty({
    description: 'Identifiers of the parents of the term',
    type: [String],
  })
  public parents!: string[];

  @ApiProperty({
    description: 'Identifiers of the children of the term',
    type: [String],
  })
  public children!: string[];
}

export class SioTerm extends SioOntologyId implements ISioTerm {
  @ApiProperty({
    description: "Name of the term",
    type: String,
  })
  public name!: string;

  @ApiProperty({
    description: "Description of the term",
    type: String, 
    nullable: true
  })
  public description: string | null = null;

  @ApiProperty({
    description: "IRI for the term",
    type: String,
    format: 'url'
  })
  public iri!: string;

  @ApiProperty({
    description: "URL with basic information about the term from an ontology browser such as OLS",
    type: String,
    format: 'url'
  })
  public url!: string;

  @ApiProperty({
    description: "URL for more information about the term",
    type: String,
    format: 'url',
    nullable: true,
  })
  public moreInfoUrl: string | null = null;

  @ApiProperty({
    description: 'Identifiers of the parents of the term',
    type: [String],
  })
  public parents!: string[];

  @ApiProperty({
    description: 'Identifiers of the children of the term',
    type: [String],
  })
  public children!: string[];
}

export class SpdxTerm extends SpdxOntologyId implements ISpdxTerm {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Name of the term",
    type: String,
  })
  public name!: string;

  @Allow()
  @ApiProperty({
    description: "Description of the term",
    type: typeof null,
    nullable: true
  })
  public description!: null;

  @Allow()
  @ApiProperty({
    description: "IRI for the term",
    type: typeof null,
    nullable: true,
  })
  public iri!: null;

  @IsUrl({
    require_protocol: true,
    protocols: ['http', 'https'],
  })
  @ApiProperty({
    description: "URL with basic information about the term from an ontology browser such as OLS",
    type: String,
    format: 'url'
  })
  public url!: string;

  @IsUrl({
    require_protocol: true,
    protocols: ['http', 'https'],
  })
  @IsOptional()
  @ApiProperty({
    description: "URL for more information about the term",
    type: String,
    format: 'url',
    nullable: true,
  })
  public moreInfoUrl: string | null = null;

  @ApiProperty({
    description: 'Identifiers of the parents of the term',
    type: [String],
  })
  public parents!: string[];

  @ApiProperty({
    description: 'Identifiers of the children of the term',
    type: [String],
  })
  public children!: string[];
}
