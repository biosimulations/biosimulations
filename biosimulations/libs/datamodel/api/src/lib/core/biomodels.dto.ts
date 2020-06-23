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
import { CreateMetaDataDTO, MetadataDTO } from './metadata.dto';

export class BiomodelParameterDTO implements BiomodelParameter {
  @ApiProperty({
    // tslint:disable-next-line: quotemark
    example: "/sbml:sbml/sbml:model/sbml:listOfSpecies/sbml:species[@id='N' ",
  })
  target!: string;
  @ApiProperty({ example: 'Species amounts/concentrations' })
  group!: string;
  @ApiProperty({ example: 'N' })
  id!: string;
  @ApiProperty({ example: 'Nitrogen' })
  name!: string;
  @ApiProperty({ type: String, example: 'Initial concentration of Nitrogen' })
  description!: string | null;
  @ApiProperty({ type: [IdentifierDTO] })
  identifiers!: IdentifierDTO[];
  @ApiProperty({
    enum: ['string', 'boolean', 'integer', 'float'],
    enumName: 'PrimitiveType',
    example: 'float',
  })
  type!: PrimitiveType;
  @ApiProperty({ type: String, example: 227 })
  value!: string | number | boolean;
  @ApiProperty({
    type: [Number, String, Boolean],
    maxItems: 2,
    minItems: 2,
    example: [22.7, 2270],
  })
  recomendedRange!: (string | number | boolean)[];
  @ApiProperty({ example: 'mole / liter' })
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
  @ApiProperty({
    enum: ['string', 'boolean', 'integer', 'float'],
    example: 'float',
  })
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
  variables!: BiomodelVariableDTO[];
  @ApiProperty()
  framework!: OntologyTermDTO;
  @ApiProperty()
  format!: FormatDTO;
  @ApiProperty()
  metadata!: MetadataDTO;
}

class CreateMetaField {
  @ApiProperty()
  metadata!: CreateMetaDataDTO;
}

@ApiExtraModels()
export class CreateBiomodelAttributesDTO extends IntersectionType(
  OmitType(BiomodelAttributesDTO, ['metadata'] as const),
  CreateMetaField,
) {}
