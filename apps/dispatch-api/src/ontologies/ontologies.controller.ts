import {
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
} from '@nestjs/common';

import { Ontologies } from '@biosimulations/datamodel/common';
import { OntologiesService } from '@biosimulations/ontology/ontologies';
import {
  ApiOperation,
  ApiParam,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  OntologyTerm,
  ErrorResponseDocument,
  OntologyInfo,
} from '@biosimulations/datamodel/api';

@Controller("ontologies")
@ApiTags('Ontologies')
export class OntologiesController {
  constructor(private service: OntologiesService) {}

  @Get('')
  @ApiOperation({
    summary: 'Get the ontologies used by BioSimulations and BioSimulators',
    description:
      'Get a list of the ontologies used by BioSimulations and BioSimulators',
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
      'Get information about an ontology such as its identifiers, version, and source',
  })
  @ApiParam({
    name: 'ontologyId',
    required: true,
    enum: Object.entries(Ontologies)
      .map((idOntology: [string, Ontologies]): string => idOntology[1])
      .sort(),
  })
  @ApiOkResponse({ type: OntologyInfo })
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
    required: true,
    enum: Object.entries(Ontologies)
      .map((idOntology: [string, Ontologies]): string => idOntology[1])
      .sort(),
  })
  @ApiOkResponse({ type: [OntologyTerm] })
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
    required: true,
    enum: Object.entries(Ontologies)
      .map((idOntology: [string, Ontologies]): string => idOntology[1])
      .sort(),
  })
  @ApiParam({
    name: 'termId',
    required: true,
    type: String,
  })
  @ApiOkResponse({ type: OntologyTerm })
  @ApiResponse({ type: ErrorResponseDocument, status: HttpStatus.NOT_FOUND })
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
