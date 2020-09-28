import { Controller } from '@nestjs/common';
import { OntologiesService } from './ontologies.service';

@Controller('ontologies')
export class OntologiesController {
  constructor(private OntologiesService: OntologiesService) { }
}
