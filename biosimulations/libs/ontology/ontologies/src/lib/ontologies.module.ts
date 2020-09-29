import { Module } from '@nestjs/common';
import { OntologiesService } from './ontologies.service';
import { OntologiesController } from './ontologies.controller';
import { KisaoController } from './kisao.controller';
import { EdamController } from './edam.controller';
import { SboController } from './sbo.controller';


@Module({
  controllers: [OntologiesController, KisaoController, EdamController, SboController],
  providers: [OntologiesService],
  exports: [OntologiesService],
})
export class OntologiesModule { }
