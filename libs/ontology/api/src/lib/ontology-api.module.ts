import { Module } from '@nestjs/common';
import { OntologyApiService } from './ontology-api.service';
import { OntologyApiController } from './ontology-api.controller';

@Module({
  controllers: [OntologyApiController],
  providers: [OntologyApiService],
  exports: [OntologyApiService],
})
export class OntologyApiModule {}
