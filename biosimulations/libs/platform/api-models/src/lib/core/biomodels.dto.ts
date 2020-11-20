import {
  BiomodelParameter,
  AlgorithmParameterType,
  BiomodelVariable,
  BiomodelAttributes,
} from '@biosimulations/datamodel/common';
import {
  ApiProperty,
  ApiExtraModels,
  OmitType,
  IntersectionType,
} from '@nestjs/swagger';
import { Identifier, Taxon, Format, OntologyTerm } from '../common';
import { AttributesMetadata, ResourceMetadata } from './metadata.dto';

export class ModelParameter implements BiomodelParameter {
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
  @ApiProperty({ type: [Identifier] })
  identifiers!: Identifier[];
  @ApiProperty({
    enum: ['string', 'boolean', 'integer', 'float'],
    enumName: 'AlgorithmParameterType',
    example: 'float',
  })
  type!: AlgorithmParameterType;
  @ApiProperty({ type: String, example: 227 })
  value!: string | number | boolean;
  @ApiProperty({
    type: [Number, String, Boolean],
    maxItems: 2,
    minItems: 2,
    example: [22.7, 2270],
    nullable: true,
  })
  recommendedRange!: (string | number | boolean)[] | null;
  @ApiProperty({ example: 'mole / liter' })
  units!: string;
}

export class ModelVariable implements BiomodelVariable {
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
  type!: AlgorithmParameterType;
  @ApiProperty()
  units!: string;

  @ApiProperty({ type: [Identifier] })
  identifiers!: Identifier[];
}

export class ModelAttributes implements BiomodelAttributes {
  @ApiProperty({ type: () => Taxon, nullable: true })
  taxon!: Taxon | null;
  @ApiProperty({ type: [ModelParameter] })
  parameters!: ModelParameter[];
  @ApiProperty({ type: [ModelVariable] })
  variables!: ModelVariable[];
  @ApiProperty()
  framework!: OntologyTerm;
  @ApiProperty()
  format!: Format;
  @ApiProperty()
  metadata!: AttributesMetadata;
}
