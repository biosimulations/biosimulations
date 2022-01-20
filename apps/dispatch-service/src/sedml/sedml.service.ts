import { Endpoints } from '@biosimulations/config/common';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CombineWrapperService } from '../combineWrapper.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, map, mergeMap, pluck } from 'rxjs';
import {
  SedDocument,
  SedModel,
  SedSimulation,
  SedAbstractTask,
  SedDataGenerator,
  SedOutput,
  CombineArchiveSedDocSpecsContent,
} from '@biosimulations/combine-api-nest-client';
import { SimulationRunService } from '@biosimulations/api-nest-client';
import { SimulationRunSedDocumentInput } from '@biosimulations/ontology/datamodel';

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
    this.logger.log(`Processing SED-ML documents for simulation run '${id}' ...`);
    const url = this.endpoints.getRunDownloadEndpoint(false, id);
    const req = this.combine.getSedMlSpecs(undefined, url);
    const sedml = req.pipe(
      pluck('data'),
      pluck('contents'),
      map(this.getSpecsFromArchiveContent.bind(this)),
      mergeMap((sedmlSpecs: SimulationRunSedDocumentInput[]) => {
        return this.submit.postSpecs(id, sedmlSpecs);
      }),
    );

    await firstValueFrom(sedml);
  }

  private getSpecsFromArchiveContent(
    contents: CombineArchiveSedDocSpecsContent[],
  ): SimulationRunSedDocumentInput[] {
    const sedmlSpecs: SimulationRunSedDocumentInput[] = [];
    contents.forEach((content: CombineArchiveSedDocSpecsContent) => {
      const id: string = content.location.path.replace('./', '');
      const spec: SedDocument = content.location.value;
      const models: SedModel[] = spec.models;
      const simulations: SedSimulation[] = spec.simulations;
      const tasks: SedAbstractTask[] = spec.tasks;
      const dataGenerators: SedDataGenerator[] = spec.dataGenerators;
      const outputs: SedOutput[] = spec.outputs;
      sedmlSpecs.push({
        id: id,
        level: spec.level,
        version: spec.version,
        models,
        simulations,
        tasks,
        dataGenerators,
        outputs,
      });
    });
    return sedmlSpecs;
  }
}
