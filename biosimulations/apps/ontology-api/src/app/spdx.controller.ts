import {
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { OntologiesService } from '@biosimulations/ontology/ontologies';
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SpdxTerm, ErrorResponseDocument, OntologyInfo } from '@biosimulations/datamodel/api';
@Controller('/spdx')
@ApiTags('SPDX')
export class SpdxController {
  constructor(private service: OntologiesService) {}

  @Get('info')
  @ApiOkResponse({ type: OntologyInfo })
  getInfo(): OntologyInfo {
    return this.service.getSpdxInfo();
  }

  @Get('list')
  @ApiOkResponse({ type: [SpdxTerm] })
  getAll() {
    return this.service.getSpdx();
  }

  @Get(':id')
  @ApiOkResponse({ type: SpdxTerm })
  @ApiResponse({ type: ErrorResponseDocument, status: HttpStatus.NOT_FOUND })
  getTerm(@Param('id') id: string): SpdxTerm {
    const term = this.service.getSpdxTerm(id);
    if (!term) {
      throw new NotFoundException(`No SPDX term with id ${id} exists`);
    }
    return term;
  }
}
