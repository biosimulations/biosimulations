import {
  BiomodelParameter,
  PrimitiveType,
  BiomodelVariable,
  BiomodelAttributes,
  OntologyTerm,
} from '@biosimulations/datamodel/core';
import {
  ApiProperty,
  ApiExtraModels,
  OmitType,
  IntersectionType,
} from '@nestjs/swagger';
import { IdentifierDTO, TaxonDTO, FormatDTO, OntologyTermDTO } from '../common';
import { CreateMetaDataDTO, MetadataDTO } from './index';

export class BiomodelParameterDTO implements BiomodelParameter {
  @ApiProperty()
  target!: string;
  @ApiProperty()
  group!: string;
  @ApiProperty()
  id!: string;
  @ApiProperty()
  name!: string;
  @ApiProperty({ type: String })
  description!: string | null;
  @ApiProperty({ type: [IdentifierDTO] })
  identifiers!: IdentifierDTO[];
  @ApiProperty({ enum: ['string', 'boolean', 'integer', 'float'] })
  type!: PrimitiveType;
  @ApiProperty({ type: String })
  value!: string | number | boolean;
  @ApiProperty({ type: [Number, String, Boolean], maxItems: 2, minItems: 2 })
  recomendedRange!: (string | number | boolean)[];
  @ApiProperty()
  units!: string;
}

export class BiomodelVariableDTO implements BiomodelVariable {
  @ApiProperty()
  target!: string;
  @ApiProperty()
  group!: string;
  @ApiProperty()
  id!: string;
  @ApiProperty()
  name!: string;
  @ApiProperty()
  description!: string;
  @ApiProperty({ enum: PrimitiveType })
  type!: PrimitiveType;
  @ApiProperty()
  units!: string;
}

export class BiomodelAttributesDTO implements BiomodelAttributes {
  @ApiProperty()
  taxon!: TaxonDTO;
  @ApiProperty({ type: [BiomodelParameterDTO] })
  parameters!: BiomodelParameterDTO[];
  @ApiProperty({ type: [BiomodelVariableDTO] })
  variables!: BiomodelVariable[];
  @ApiProperty()
  framework!: OntologyTermDTO;
  @ApiProperty()
  format!: FormatDTO;
  @ApiProperty()
  metadata!: MetadataDTO;
}

export class CreateBiomodelAttributesDTO extends IntersectionType(
  OmitType(BiomodelAttributesDTO, ['metadata']),
  class _ {
    metadata!: CreateMetaDataDTO;
  },
) {}
