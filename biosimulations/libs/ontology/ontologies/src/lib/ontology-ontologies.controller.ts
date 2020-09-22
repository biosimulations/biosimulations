import { Controller } from '@nestjs/common';
import { OntologyOntologiesService } from './ontology-ontologies.service';

@Controller('ontology-ontologies')
export class OntologyOntologiesController {
  constructor(private ontologyOntologiesService: OntologyOntologiesService) {}
}
