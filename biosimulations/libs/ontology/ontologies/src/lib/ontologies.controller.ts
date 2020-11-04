import { Controller, Get } from '@nestjs/common';
import { OntologiesService } from './ontologies.service';
import { edamTerms } from '@biosimulations/ontology/sources'
import { Ontologies } from '@biosimulations/shared/datamodel';
@Controller()

export class OntologiesController {
  constructor(private OntologiesService: OntologiesService) { }

  @Get("/list")
  ontologyList() {
    return Ontologies
  }
}
