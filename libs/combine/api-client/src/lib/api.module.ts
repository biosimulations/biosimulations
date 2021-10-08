import {
  DynamicModule,
  HttpService,
  HttpModule,
  Module,
  Global,
} from '@nestjs/common';
import { Configuration } from './configuration';

import { MetadataOMEXMetadataService } from './api/metadataOMEXMetadata.service';
import { ModelService } from './api/model.service';
import { SimulationAlgorithmsKiSAOService } from './api/simulationAlgorithmsKiSAO.service';
import { SimulationExecutionService } from './api/simulationExecution.service';
import { SimulationExperimentsSEDMLService } from './api/simulationExperimentsSEDML.service';
import { SimulationProjectsCOMBINEOMEXArchivesService } from './api/simulationProjectsCOMBINEOMEXArchives.service';
import { ValidationService } from './api/validation.service';

@Global()
@Module({
  imports: [HttpModule],
  exports: [
    MetadataOMEXMetadataService,
    ModelService,
    SimulationAlgorithmsKiSAOService,
    SimulationExecutionService,
    SimulationExperimentsSEDMLService,
    SimulationProjectsCOMBINEOMEXArchivesService,
    ValidationService,
  ],
  providers: [
    MetadataOMEXMetadataService,
    ModelService,
    SimulationAlgorithmsKiSAOService,
    SimulationExecutionService,
    SimulationExperimentsSEDMLService,
    SimulationProjectsCOMBINEOMEXArchivesService,
    ValidationService,
  ],
})
export class ApiModule {
  public static forRoot(
    configurationFactory: () => Configuration,
  ): DynamicModule {
    return {
      module: ApiModule,
      providers: [{ provide: Configuration, useFactory: configurationFactory }],
    };
  }

  constructor(httpService: HttpService) {}
}
