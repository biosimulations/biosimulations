import {
  Controller,
  Get,
  NotFoundException,
  Param,
} from '@nestjs/common';

import { Ontologies } from '@biosimulations/datamodel/common';
import { OntologiesService } from '@biosimulations/ontology/ontologies';
import {
  ApiOperation,
  ApiParam,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  OntologyTerm,
  ErrorResponseDocument,
  OntologyInfo,
} from '@biosimulations/datamodel/api';

@Controller('ontologies')
@ApiTags('Ontologies')
export class OntologiesController {
  constructor(private service: OntologiesService) {}

  @Get()
  @ApiOperation({
    summary: 'Get the ontologies used by BioSimulations and BioSimulators',
    description:
      'Get a list of the ids of the ontologies used by BioSimulations and BioSimulators',
  })
  @ApiOkResponse({
    description: 'The ids of the ontologies used by BioSimulations and BioSimulators were successfully retrieved',
    type: [String],
  })
  getList(): string[] {
    const ontologiesIds = new Set<string>();
    for (const [key, val] of Object.entries(Ontologies)) {
      ontologiesIds.add(key);
    }

    return [...ontologiesIds].sort();
  }

  @Get(':ontologyId/info')
  @ApiOperation({
    summary: 'Get information about an ontology',
    description:
      'Get information about an ontology, such as its identifiers, version, and source',
  })
  @ApiParam({
    name: 'ontologyId',
    description: 'Id of the ontology',
    required: true,
    enum: Object.entries(Ontologies)
      .map((idOntology: [string, Ontologies]): string => idOntology[1])
      .sort(),
  })
  @ApiOkResponse({
    description: 'Information about the ontology was successfully retrieved',
    type: OntologyInfo,
  })
  @ApiNotFoundResponse({
    description: 'No ontology has the requested id',
    type: ErrorResponseDocument,
  })
  getInfo(@Param('ontologyId') ontologyId: Ontologies): OntologyInfo {
    const info = this.service.getInfo(ontologyId);
    if (!info) {
      throw new NotFoundException(`No ontology with id ${ontologyId} exists`);
    }
    return info;
  }

  @Get(':ontologyId/list')
  @ApiOperation({
    summary: 'Get the terms in an ontology',
    description: 'Get a list of the terms in an ontology',
  })
  @ApiParam({
    name: 'ontologyId',
    description: 'Id of the ontology',
    required: true,
    enum: Object.entries(Ontologies)
      .map((idOntology: [string, Ontologies]): string => idOntology[1])
      .sort(),
  })
  @ApiOkResponse({
    description: 'The terms of the ontology were successfully retrieved',
    type: [OntologyTerm],
  })
  @ApiNotFoundResponse({
    description: 'No ontology has the requested id',
    type: ErrorResponseDocument,
  })
  getTerms(@Param('ontologyId') ontologyId: Ontologies) {
    const terms = this.service.getTerms(ontologyId);
    if (!terms) {
      throw new NotFoundException(`No ontology with id ${ontologyId} exists`);
    }
    return terms;
  }

  @Get(':ontologyId/:termId')
  @ApiOperation({
    summary: 'Get a term in an ontology',
    description:
      'Get the name, description, IRI, and URL of a term in an ontology',
  })
  @ApiParam({
    name: 'ontologyId',
    description: 'Id of the ontology',
    required: true,
    enum: Object.entries(Ontologies)
      .map((idOntology: [string, Ontologies]): string => idOntology[1])
      .sort(),
  })
  @ApiParam({
    name: 'termId',
    description: 'Id of the term (e.g., `KISAO_0000019` for the KiSAO ontology).',
    required: true,
    type: String,
  })
  @ApiOkResponse({
    description: 'Information about the term was successfully retrieved',
    type: OntologyTerm,
  })
  @ApiNotFoundResponse({
    description: 'No term has the requested ontology and term ids',
    type: ErrorResponseDocument,
  })
  getTerm(
    @Param('ontologyId') ontologyId: Ontologies,
    @Param('termId') termId: string,
  ): OntologyTerm {
    const term = this.service.getTerm(ontologyId, termId);
    if (!term) {
      throw new NotFoundException(
        `No '${ontologyId}' term with id '${termId}' exists`,
      );
    }
    return term;
  }
}
