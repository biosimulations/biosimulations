import { Endpoints } from '@biosimulations/config/common';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CombineWrapperService } from '../combineWrapper.service';
import { map, Observable, pluck, throwError } from 'rxjs';
import {
  CombineArchiveSedDocSpecsContent,
  SedAbstractTask,
  SedDataGenerator,
  SedDocument,
  SedModel,
  SedOutput,
  SedSimulation,
  SedStyle,
} from '@biosimulations/combine-api-nest-client';
import { SimulationRunSedDocumentInput } from '@biosimulations/ontology/datamodel';
import { catchError } from 'rxjs/operators';

@Injectable()
export class SedmlService {
  private logger = new Logger(SedmlService.name);
  private endpoints: Endpoints;

  public constructor(private config: ConfigService, private combine: CombineWrapperService) {
    const env = config.get('server.env');
    this.endpoints = new Endpoints(env);
  }

  public processSedml(id: string): Observable<SimulationRunSedDocumentInput[]> {
    this.logger.log(`Processing SED-ML documents for simulation run '${id}' ...`);
    const url = this.endpoints.getSimulationRunDownloadEndpoint(true, id);
    const sedml = this.combine.getSedMlSpecs(undefined, url).pipe(
      pluck('data'),
      pluck('contents'),
      map(this.getSpecsFromArchiveContent.bind(this)),
      catchError((error) => {
        this.logger.error(`Error processing SED-ML documents for simulation run '${id}': ${error.message}`);
        return throwError(
          () => new Error(`Error processing SED-ML documents for simulation run '${id}': ${error.message}`),
        );
      }),
    );
    return sedml;
  }

  private getSpecsFromArchiveContent(contents: CombineArchiveSedDocSpecsContent[]): SimulationRunSedDocumentInput[] {
    const sedmlSpecs: SimulationRunSedDocumentInput[] = [];
    contents.forEach((content: CombineArchiveSedDocSpecsContent) => {
      const id: string = content.location.path.replace('./', '');
      const spec: SedDocument = content.location.value;
      const styles: SedStyle[] = spec.styles;
      const models: SedModel[] = spec.models;
      const simulations: SedSimulation[] = spec.simulations;
      const tasks: SedAbstractTask[] = spec.tasks;
      const dataGenerators: SedDataGenerator[] = spec.dataGenerators;
      const outputs: SedOutput[] = spec.outputs;
      sedmlSpecs.push({
        id: id,
        level: spec.level,
        version: spec.version,
        styles,
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
