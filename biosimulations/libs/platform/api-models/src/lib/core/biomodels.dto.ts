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

  @ApiProperty({ example: 'Nitrogen', nullable: true, required: false, default: null })
  name!: string | null;

  @ApiProperty({ type: String, nullable: true, required: false, default: null,
    example: 'Initial concentration of Nitrogen' })
  description!: string | null;

  @ApiProperty({ type: [Identifier] })
  identifiers!: Identifier[];

  @ApiProperty({
    enum: ['string', 'boolean', 'integer', 'float'],
    enumName: 'AlgorithmParameterType',
    example: 'float',
  })
  type!: AlgorithmParameterType;

  @ApiProperty({ 
    type: String,
    nullable: true,
    example: "227",
  })
  value!: string | null;

  @ApiProperty({
    type: [String],
    example: ["22.7", "2270"],
    nullable: true,
    required: false,
    default: null,
  })
  recommendedRange!: string[] | null;

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

  @ApiProperty({ type: String, nullable: true, required: false, default: null })
  name!: string | null;

  @ApiProperty({ type: String, nullable: true, required: false, default: null })
  description!: string | null;

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
