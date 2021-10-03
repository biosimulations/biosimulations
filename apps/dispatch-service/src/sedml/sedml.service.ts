import { Endpoints } from '@biosimulations/config/common';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CombineWrapperService } from '../combineWrapper.service';
import { HttpService } from '@nestjs/axios';
import { map, pluck } from 'rxjs';
import {
  CombineArchiveContent,
  SedDocument,
  SedDataGenerator,
  SedModel,
  SedTask,
  SedSimulation,
  SedOutput,
} from '@biosimulations/combine-api-client';

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
      map((sedmlSpecs: SedMLSpecs[]) => {
        // TODO send to api
        return sedmlSpecs;
      }),
    );

    const sedmlstring = await sedml.toPromise();
  }

  private getSpecsFromArchiveContent(
    contents: CombineArchiveContent[],
  ): SedMLSpecs[] {
    const sedmlSpecs: SedMLSpecs[] = [];
    contents.forEach((content: CombineArchiveContent) => {
      const id: string = content.location.path;
      const spec: SedDocument = content.location.value as SedDocument;

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
