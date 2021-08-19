import { Module } from '@nestjs/common';
import { OntologiesController } from './ontologies.controller';
import { OntologiesModule as OntSourcesModule } from '@biosimulations/ontology/ontologies';
@Module({
  imports: [OntSourcesModule],
  controllers: [OntologiesController],
})
export class OntologiesModule {}
