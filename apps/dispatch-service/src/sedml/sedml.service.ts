import { Endpoints } from '@biosimulations/config/common';
import { Injectable, Logger } from '@nestjs/common';
import { CombineWrapperService } from '../combineWrapper.service';
import { HttpService } from '@nestjs/axios';
import { map, mergeMap, pluck } from 'rxjs';
import {
  SedDocument,
  CombineArchiveSedDocSpecsContent,
} from '@biosimulations/combine-api-client';
import { SimulationRunService } from '@biosimulations/api-nest-client';
import { SimulationRunSedDocumentInput } from '@biosimulations/ontology/datamodel';

@Injectable()
export class SedmlService {
  private logger = new Logger(SedmlService.name);
  private endpoints: Endpoints;

  public constructor(
    private combine: CombineWrapperService,
    private httpService: HttpService,
    private submit: SimulationRunService,
  ) {
    this.endpoints = new Endpoints();
  }

  public async processSedml(id: string): Promise<void> {
    this.logger.log(`Processing SED-ML documents for simulation run '${id}'.`);
    const url = this.endpoints.getRunDownloadEndpoint(id);
    const req = this.combine.getSedMlSpecs(undefined, url);
    const sedml = req.pipe(
      pluck('data'),
      pluck('contents'),
      map(this.getSpecsFromArchiveContent.bind(this, id)),
      mergeMap((sedmlSpecs: SimulationRunSedDocumentInput[]) => {
        return this.submit.postSpecs(id, sedmlSpecs);
      }),
    );

    await sedml.toPromise();
  }

  private getSpecsFromArchiveContent(
    simulationRun: string,
    contents: CombineArchiveSedDocSpecsContent[],
  ): SimulationRunSedDocumentInput[] {
    const sedmlSpecs: SimulationRunSedDocumentInput[] = [];
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
      });
    });
    return sedmlSpecs;
  }
}
