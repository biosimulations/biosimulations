import { Controller, Get } from '@nestjs/common';

import { Ontologies } from '@biosimulations/datamodel/common';
import { ApiTags } from '@nestjs/swagger';
@Controller()
@ApiTags('Info')
export class OntologiesController {
  constructor() {}

  @Get('/list')
  ontologyList(): string[] {
    const ontologiesIds = new Set<string>();
    for (const [key, val] of Object.entries(Ontologies)) {
        if (key !== 'URL' && key !== 'SPDX') {
            ontologiesIds.add(key);
        }
    }

    return [...ontologiesIds].sort();
  }
}
