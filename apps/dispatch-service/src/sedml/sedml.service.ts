import { Endpoints } from '@biosimulations/config/common';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CombineWrapperService } from '../combineWrapper.service';
import { HttpService } from '@nestjs/axios';
import { map, mergeMap, pluck } from 'rxjs';
import {
  SedDocument,
  SedDataGenerator,
  SedModel,
  SedTask,
  SedSimulation,
  SedOutput,
  CombineArchiveSedDocSpecsContent,
} from '@biosimulations/combine-api-client';
import { SimulationRunService } from '@biosimulations/backend-api-client';
import { SimulationRunSedDocument } from '@biosimulations/datamodel/api';

// TODO move to api lib
interface SedMLSpecs {
  id: string;
  dataGenerators: SedDataGenerator[];
  models: SedModel[];
  tasks: SedTask[];
  simulations: SedSimulation[];
  outputs: SedOutput[];
}
@Injectable()
export class SedmlService {
  private logger = new Logger(SedmlService.name);
  private endpoints: Endpoints;

  public constructor(
    private config: ConfigService,
    private combine: CombineWrapperService,
    private httpService: HttpService,
    private submit: SimulationRunService,
  ) {
    const env = config.get('server.env');
    this.endpoints = new Endpoints(env);
  }

  public async processSedml(id: string): Promise<void> {
    this.logger.log(`Processing SED-ML file for  ${id}`);
    const url = this.endpoints.getRunDownloadEndpoint(id, true);
    const req = this.combine.getSedMlSpecs(undefined, url);
    const sedml = req.pipe(
      pluck('data'),
      pluck('contents'),
      map(this.getSpecsFromArchiveContent),
      mergeMap((sedmlSpecs: SedMLSpecs[]) => {
        const apiSpecs = sedmlSpecs.map(
          (sedmlSpec: SedMLSpecs): SimulationRunSedDocument => {
            return {
              id: sedmlSpec.id,
              dataGenerators: sedmlSpec.dataGenerators,
              models: sedmlSpec.models,
              outputs: sedmlSpec.outputs,
              tasks: sedmlSpec.tasks,
              simulations: sedmlSpec.simulations,
              simulationRun: id,
              created: '',
              updated: '',
            };
          },
        );
        return this.submit.postSpecs(id, apiSpecs);
      }),
    );

    const sedmlstring = await sedml.toPromise();
  }

  private getSpecsFromArchiveContent(
    contents: CombineArchiveSedDocSpecsContent[],
  ): SedMLSpecs[] {
    const sedmlSpecs: SedMLSpecs[] = [];
    contents.forEach((content: CombineArchiveSedDocSpecsContent) => {
      const id: string = content.location.path.replace('./', '');
      const spec: SedDocument = content.location.value;

      sedmlSpecs.push({
        id: id,
        dataGenerators: spec.dataGenerators,
        models: spec.models,
        outputs: spec.outputs,
        tasks: spec.tasks,
        simulations: spec.simulations,
      });
    });
    return sedmlSpecs;
  }
}
