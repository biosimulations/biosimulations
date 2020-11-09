import { Ontologies } from '@biosimulations/datamodel/common';
import { Module } from '@nestjs/common';
import { OntologiesModule } from '@biosimulations/ontology/ontologies';
import { BiosimulationsConfigModule } from '@biosimulations/config/nest';
import { SwaggerModule } from '@nestjs/swagger';
import { OntologiesController } from './ontologies.controller';
import { KisaoController } from './kisao.controller';
import { EdamController } from './edam.controller';
import { SboController } from './sbo.controller';
@Module({
  imports: [OntologiesModule, SwaggerModule, BiosimulationsConfigModule],
  controllers: [
    OntologiesController,
    KisaoController,
    EdamController,
    SboController,
  ],
  providers: [],
})
export class AppModule {}
