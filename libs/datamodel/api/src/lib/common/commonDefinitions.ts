/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import {
  LabeledIdentifier as ILabeledIdentifier,
  DescribedIdentifier as IDescribedIdentifier,
} from '@biosimulations/datamodel/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LabeledIdentifier implements ILabeledIdentifier {
  @ApiProperty({ oneOf: [{ type: 'string' }, { type: 'null' }] })
  uri!: string | null;
  @ApiProperty({ type: 'string' })
  label!: string | null;
}

export class DescribedIdentifier
  extends LabeledIdentifier
  implements IDescribedIdentifier
{
  @ApiProperty()
  uri!: string | null;
  @ApiProperty()
  label!: string | null;
  @ApiPropertyOptional()
  attribute_uri?: string | null;
  @ApiPropertyOptional()
  attribute_label?: string | null;
}

export const CREATORS = {
  type: [LabeledIdentifier],
  description: 'An entity responsible for making the resource',
  externalDocs: {
    description: 'Dublin Core Metadata Terms Creator',
    url: 'https://www.dublincore.org/specifications/dublin-core/dcmi-terms/#http://purl.org/dc/terms/creator',
  },
  example: [
    {
      label: 'Bilal Shaikh',
      uri: 'https://identifiers.org/orcid:0000-0001-5801-5510',
    },
    {
      label: 'Jonathan Karr',
      uri: 'https://identifiers.org/orcid:0000-0002-2605-5080',
    },
  ],
};

export const CONTRIBUTORS = {
  type: [LabeledIdentifier],
  description:
    'An entity responsible for making contributions to the resource.',
  externalDocs: {
    description: 'Dublin Core Metadata Terms Creator',
    url: 'https://www.dublincore.org/specifications/dublin-core/dcmi-terms/#http://purl.org/dc/terms/contributor',
  },
  example: [
    {
      label: 'Ion Moraru',
      uri: 'https://identifiers.org/orcid:0000-0002-3746-9676',
    },
    {
      label: 'Herbert Sauro',
      uri: 'https://identifiers.org/orcid:0000-0002-3659-6817',
    },
  ],
};

export const LICENCE = {
  type: LabeledIdentifier,
  description: 'The licence under which the resource is available',
  externalDocs: {
    description: 'Dublin Core Metadata Terms Licence',
    url: 'https://www.dublincore.org/specifications/dublin-core/dcmi-terms/#http://purl.org/dc/terms/license',
  },
  example: {
    label: 'CC0 1.0 Universal',
    uri: 'https://creativecommons.org/publicdomain/zero/1.0/',
  },
};

export const KEYWORDS = {
  type: [LabeledIdentifier],
  description: 'Keywords likey to be used in search queries',
  externalDocs: {
    description: 'Prism Standard Keyword',
    url: 'http://www.prismstandard.org/specifications/3.0/PRISM_Basic_Metadata_3.0.htm#_Toc336960532',
  },
  example: [
    { label: 'cancer', uri: null },
    { label: 'mitosis', uri: null },
  ],
};

export const TITLE = {
  type: String,
  description: 'The title of the resource',
  externalDocs: {
    description: 'Dublin Core Metadata Terms Title',
    url: 'https://www.dublincore.org/specifications/dublin-core/dcmi-terms/#http://purl.org/dc/terms/title',
  },
  example:
    'RunBioSimulations: an extensible web application that simulates a wide range of computational modeling frameworks, algorithms, and formats',
};

export const ABSTRACT = {
  type: String,
  description: 'A short summary of the resource',
  externalDocs: {
    description: 'Dublin Core Metadata Terms Abstact',
    url: 'https://www.dublincore.org/specifications/dublin-core/dcmi-terms/#http://purl.org/dc/terms/abstract',
  },
  example:
    'This application provides a web-based platform for the simulation of computational modeling frameworks, algorithms, and formats.',
};

export const DESCRIPTION = {
  type: String,
  description: 'A detailed description of the resource',
  externalDocs: {
    description: 'Dublin Core Metadata Terms Description',
    url: 'https://www.dublincore.org/specifications/dublin-core/dcmi-terms/#http://purl.org/dc/terms/description',
  },
  example:
    'Comprehensive, predictive computational models have significant potential for science, bioengineering, and medicine. One promising way to achieve more predictive models is to combine submodels of multiple subsystems. To capture the multiple scales of biology, these submodels will likely require multiple modeling frameworks and simulation algorithms. Several community resources are already available for working with many of these frameworks and algorithms. However, the variety and sheer number of these resources make it challenging to find and use appropriate tools for each model, especially for novice modelers and experimentalists. To make these resources easier to use, we developed runBioSimulations (https://run.biosimulations.org), a single web application for executing a broad range of models. runBioSimulations leverages community resources, including BioSimulators, a new open registry of simulation tools. These resources currently enable runBioSimulations to execute nine frameworks and 44 algorithms, and they make runBioSimulations extensible to additional frameworks and algorithms. runBioSimulations also provides features for sharing simulations and interactively visualizing their results. We anticipate that runBioSimulations will foster reproducibility, stimulate collaboration, and ultimately facilitate the creation of more predictive models.',
};

export const TAXA = {
  type: [LabeledIdentifier],
  description: 'The biological entity represented by the model element',
  externalDocs: {
    description: 'Biomodels Biology Qualifiers hasTaxon',
    url: 'http://biomodels.net/biology-qualifiers/hasTaxon',
  },
  example: [
    {
      label: 'Severe acute respiratory syndrome coronavirus 2',
      uri: 'http://identifiers.org/taxonomy/2697049',
    },
    { label: 'Homo Sapiens', uri: 'http://identifiers.org/taxonomy/9606' },
  ],
};

export const ENCODES = {
  type: [LabeledIdentifier],
  description:
    'Other biology (e.g., cell type, organ) captured by a modeling project',
  externalDocs: {
    description: 'Biomodels Biology Qualifiers encodes',
    url: 'http://biomodels.net/biology-qualifiers/encodes',
  },
  example: [
    {
      label: 'ATP Binding',
      uri: 'https://identifiers.org/GO:0005524',
    },
    {
      label: 'Protein Kinase Activity',
      uri: 'https://identifiers.org/GO:0004672',
    },
  ],
};

export const SOURCES = {
  type: [LabeledIdentifier],
  description: 'The source code or definition of the modeling project',
  externalDocs: {
    description: 'Dublin Core Metadata Terms Source',
    url: 'https://www.dublincore.org/specifications/dublin-core/dcmi-terms/#http://purl.org/dc/terms/source',
  },
  example: [
    {
      label: 'Source code',
      uri: 'https://identifiers.org/doi:10.5281/zenodo.5057108',
    },
  ],
};

export const PREDECESSORS = {
  type: [LabeledIdentifier],
  description:
    'Other modeling projects that were used as a basis for this project',
  externalDocs: {
    description: 'Biomodels Model Qualifiers isDerivedFrom',
    url: 'http://biomodels.net/model-qualifiers/isDerivedFrom',
  },
  example: [
    {
      label: 'Balagaddé2008_E_coli_Predator_Prey',
      uri: 'https://identifiers.org/biomodels.db:BIOMD0000000296',
    },
  ],
};

export const SUCCESSORS = {
  type: [LabeledIdentifier],
  description: 'Other modeling projects that were based on this project',
  externalDocs: {
    description: 'The Scholarly Contributions and Roles Ontology Successor',
    url: 'https://sparontologies.github.io/scoro/current/scoro.html#d4e2176',
  },
  example: [
    {
      label: 'Leloup1999_CircadianRhythms_Drosophila',
      uri: 'https://www.ebi.ac.uk/biomodels/BIOMD0000000298',
    },
  ],
};

export const SEEALSO = {
  type: [LabeledIdentifier],
  description: 'More information about a modeling project',
  externalDocs: {
    description: 'RDF Schema See Also',
    url: 'https://www.w3.org/TR/rdf-schema/#ch_seealso',
  },
  example: [
    {
      label: 'Karr Lab Website',
      uri: 'https://karrlab.org',
    },
  ],
};
export const IDENTIFIERS = {
  type: [LabeledIdentifier],
  description: 'Identifiers for a modeling project',
  externalDocs: {
    description: 'Biomodels Model Qualifiers Is',
    url: 'http://biomodels.net/model-qualifiers/is',
  },
  example: [
    {
      label: 'BIOMD0000000296',
      uri: 'https://identifiers.org/biomodels.db:BIOMD0000000296',
    },
  ],
};

export const CITATIONS = {
  type: [LabeledIdentifier],
  description: 'Citations for a modeling project',
  externalDocs: {
    description: 'Biomodels Model Qualifiers IsDescribedBy',
    url: 'http://biomodels.net/model-qualifiers/isDescribedBy',
  },
  example: [
    {
      label: 'J Cell Biol (2003) 163 (6): 1243–1254.',
      uri: 'https://identifiers.org/doi:10.1083/jcb.200306139',
    },
  ],
};

export const FUNDERS = {
  type: [LabeledIdentifier],
  description: 'Funder for a modeling project',
  externalDocs: {
    description: 'The Scholarly Contributions and Roles Ontology Funder',
    url: 'https://sparontologies.github.io/scoro/current/scoro.html#d4e1256',
  },
  example: [
    {
      label: 'DARPA',
      uri: 'https://identifiers.org/doi:10.13039/100000185',
    },
  ],
};

export const CREATED = {
  type: String,
  description: 'The date the modeling project was created',
  externalDocs: {
    description: 'Dublin Core Metadata Terms Date Created',
    url: 'https://www.dublincore.org/specifications/dublin-core/dcmi-terms/#http://purl.org/dc/terms/created',
  },
  example: '2018-01-01',
};

export const MODIFIED = {
  type: [String],
  description: 'The dates the modeling project was modified',
  externalDocs: {
    description: 'Dublin Core Metadata Terms Date Modified',
    url: 'https://www.dublincore.org/specifications/dublin-core/dcmi-terms/#http://purl.org/dc/terms/modified',
  },
  example: ['2018-01-01', '2018-01-02'],
};
