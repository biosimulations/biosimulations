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
import { EdamTerm, ErrorResponseDocument, OntologyInfo } from '@biosimulations/datamodel/api';
@Controller('/edam')
@ApiTags('EDAM')
export class EdamController {
  constructor(private service: OntologiesService) {}

  @Get('info')
  @ApiOkResponse({ type: OntologyInfo })
  getInfo(): OntologyInfo {
    return this.service.getEdamInfo();
  }

  @Get('list')
  @ApiOkResponse({ type: [EdamTerm] })
  getAll() {
    return this.service.getEdam();
  }

  @Get(':id')
  @ApiOkResponse({ type: EdamTerm })
  @ApiResponse({ type: ErrorResponseDocument, status: HttpStatus.NOT_FOUND })
  getTerm(@Param('id') id: string): EdamTerm {
    const term = this.service.getEdamTerm(id);
    if (!term) {
      throw new NotFoundException(`No EDAM Term with id ${id} exists`);
    }
    return term;
  }
}
