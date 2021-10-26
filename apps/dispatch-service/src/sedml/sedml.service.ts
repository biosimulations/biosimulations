import { Endpoints } from '@biosimulations/config/common';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CombineWrapperService } from '../combineWrapper.service';
import { HttpService } from '@nestjs/axios';
import { map, mergeMap, pluck } from 'rxjs';
import {
  SedDocument,
  CombineArchiveSedDocSpecsContent,
} from '@biosimulations/combine-api-client';
import { SimulationRunService } from '@biosimulations/api-nest-client';
import { SimulationRunSedDocument } from '@biosimulations/datamodel/api';

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
      map(this.getSpecsFromArchiveContent.bind(this, id)),
      mergeMap((sedmlSpecs: SimulationRunSedDocument[]) => {
        return this.submit.postSpecs(id, sedmlSpecs);
      }),
    );

    const sedmlstring = await sedml.toPromise();
  }

  private getSpecsFromArchiveContent(
    simulationRun: string,
    contents: CombineArchiveSedDocSpecsContent[],
  ): SimulationRunSedDocument[] {
    const sedmlSpecs: SimulationRunSedDocument[] = [];
    contents.forEach((content: CombineArchiveSedDocSpecsContent) => {
      const id: string = content.location.path.replace('./', '');
      const spec: SedDocument = content.location.value;

      sedmlSpecs.push({
        simulationRun: simulationRun,
        id: id,
        dataGenerators: spec.dataGenerators,
        models: spec.models,
        outputs: spec.outputs,
        tasks: spec.tasks,
        simulations: spec.simulations,
        created: '',
        updated: '',
      });
    });
    return sedmlSpecs;
  }
}
