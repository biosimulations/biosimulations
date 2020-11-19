import { ErrorResponseDocument, SioTerm } from '@biosimulations/datamodel/api';
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
@Controller('/sio')
@ApiTags('SIO')
export class SioController {
  constructor(private service: OntologiesService) {}

  @Get('list')
  @ApiOkResponse({ type: [SioTerm] })
  getAll(): SioTerm[] {
    return this.service.getSIO();
  }

  @Get(':id')
  @ApiOkResponse({ type: SioTerm })
  @ApiNotFoundResponse({
    type: ErrorResponseDocument,
  })
  getTerm(@Param('id') id: string): SioTerm {
    const term = this.service.getSioTerm(id);
    if (!term) {
      throw new NotFoundException(`No SIO term with id ${id} exists`);
    }
    return term;
  }
}
