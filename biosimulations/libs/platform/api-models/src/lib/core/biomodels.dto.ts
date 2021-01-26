import {
  BiomodelParameter,
  ValueType,
  BiomodelVariable,
  BiomodelAttributes,
} from '@biosimulations/datamodel/common';
import {
  ApiProperty,
} from '@nestjs/swagger';
import { Identifier, Taxon, Format, OntologyTerm } from '../common';
import { AttributesMetadata } from './metadata.dto';

export class ModelParameter implements BiomodelParameter {
  @ApiProperty({
    type: String,
    // tslint:disable-next-line: quotemark
    example: "/sbml:sbml/sbml:model/sbml:listOfSpecies/sbml:species[@id='N' ",
  })
  target!: string;

  @ApiProperty({ type: String, example: 'Species amounts/concentrations' })
  group!: string;

  @ApiProperty({ type: String, example: 'N' })
  id!: string;

  @ApiProperty({
    type: String,
    example: 'Nitrogen',
    nullable: true,
    required: false,
    default: null,
  })
  name!: string | null;

  @ApiProperty({
    type: String,
    nullable: true,
    required: false,
    default: null,
    example: 'Initial concentration of Nitrogen',
  })
  description!: string | null;

  @ApiProperty({ type: [Identifier] })
  identifiers!: Identifier[];

  @ApiProperty({
    type: String,
    enum: ValueType,
    enumName: 'ValueType',
    example: 'float',
  })
  type!: ValueType;

  @ApiProperty({
    type: String,
    nullable: true,
    example: '227',
  })
  value!: string | null;

  @ApiProperty({
    type: [String],
    example: ['22.7', '2270'],
    nullable: true,
    required: false,
    default: null,
  })
  recommendedRange!: string[] | null;

  @ApiProperty({ type: String, example: 'mole / liter' })
  units!: string;
}

export class ModelVariable implements BiomodelVariable {
  @ApiProperty({ type: String })
  target!: string;

  @ApiProperty({ type: String })
  group!: string;

  @ApiProperty({ type: String })
  id!: string;

  @ApiProperty({ type: String, nullable: true, required: false, default: null })
  name!: string | null;

  @ApiProperty({ type: String, nullable: true, required: false, default: null })
  description!: string | null;

  @ApiProperty({
    type: String,
    enum: ValueType,
    example: 'float',
  })
  type!: ValueType;

  @ApiProperty({ type: String })
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

  @ApiProperty({ type: OntologyTerm })
  framework!: OntologyTerm;

  @ApiProperty({ type: Format })
  format!: Format;

  @ApiProperty({ type: AttributesMetadata })
  metadata!: AttributesMetadata;
}
