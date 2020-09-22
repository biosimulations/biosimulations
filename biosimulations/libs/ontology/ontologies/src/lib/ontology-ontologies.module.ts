import { Module } from '@nestjs/common';
import { OntologyOntologiesService } from './ontology-ontologies.service';
import { OntologyOntologiesController } from './ontology-ontologies.controller';

@Module({
  controllers: [OntologyOntologiesController],
  providers: [OntologyOntologiesService],
  exports: [OntologyOntologiesService],
})
export class OntologyOntologiesModule {}
