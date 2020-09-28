import { Ontologies } from '@biosimulations/shared/datamodel';
import { Module } from '@nestjs/common';
import { OntologiesModule } from '@biosimulations/ontology/ontologies'
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [OntologiesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
