import {
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';

import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  ErrorResponseDocument,
  KisaoTerm,
  OntologyInfo,
} from '@biosimulations/datamodel/api';
import { OntologiesService } from '@biosimulations/ontology/ontologies';

@Controller('/kisao')
@ApiTags('KISAO')
export class KisaoController {
  constructor(private service: OntologiesService) {}

  @Get('info')
  @ApiOkResponse({ type: OntologyInfo })
  getInfo(): OntologyInfo {
    return this.service.getKisaoInfo();
  }

  @Get('list')
  @ApiOkResponse({ type: [KisaoTerm] })
  getAll(): KisaoTerm[] {
    return this.service.getKisao();
  }

  @Get(':id')
  @ApiOkResponse({ type: KisaoTerm })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: ErrorResponseDocument })
  getTerm(@Param('id') id: string): KisaoTerm {
    const term = this.service.getKisaoTerm(id);
    if (!term) {
      throw new NotFoundException(`No KISAO Term with id ${id} exists `);
    }
    return term;
  }
}
