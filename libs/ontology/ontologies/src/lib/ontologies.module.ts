import { Module } from '@nestjs/common';
import { OntologiesService } from './ontologies.service';

@Module({
  controllers: [],
  providers: [OntologiesService],
  exports: [OntologiesService],
})
export class OntologiesModule {}
