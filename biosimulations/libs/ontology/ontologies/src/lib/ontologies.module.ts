import { Module } from '@nestjs/common';
import { OntologiesService } from './ontologies.service';
import { OntologiesController } from './ontologies.controller';

@Module({
  controllers: [OntologiesController],
  providers: [OntologiesService],
  exports: [OntologiesService],
})
export class OntologiesModule { }
