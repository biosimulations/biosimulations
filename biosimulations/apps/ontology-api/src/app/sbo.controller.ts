import { ErrorResponseDocument, SboTerm, OntologyInfo } from '@biosimulations/datamodel/api';
import { OntologiesService } from '@biosimulations/ontology/ontologies';

import {
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';

import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
@Controller('/sbo')
@ApiTags('SBO')
export class SboController {
  constructor(private service: OntologiesService) {}

  @Get('info')
  @ApiOkResponse({ type: OntologyInfo })
  getInfo(): OntologyInfo {
    return this.service.getSboInfo();
  }

  @Get('list')
  @ApiOkResponse({ type: [SboTerm] })
  getAll(): SboTerm[] {
    return this.service.getSbo();
  }

  @Get(':id')
  @ApiOkResponse({ type: SboTerm })
  @ApiNotFoundResponse({
    type: ErrorResponseDocument,
  })
  getTerm(@Param('id') id: string): SboTerm {
    const term = this.service.getSboTerm(id);
    if (!term) {
      throw new NotFoundException(`No SBO term with id ${id} exists`);
    }
    return term;
  }
}
