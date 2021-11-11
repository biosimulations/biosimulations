import { Dataset, SimulationHDFService } from '@biosimulations/hsds/client';
import { SharedStorageService } from '@biosimulations/shared/storage';
import {
  Injectable,
  Logger,
  NotFoundException,
  HttpStatus,
} from '@nestjs/common';
import { Output, OutputData, Results } from './datamodel';
import { S3 } from 'aws-sdk';
import { Endpoints } from '@biosimulations/config/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ResultsService {
  private endpoints: Endpoints;

  public constructor(
    private storage: SharedStorageService,
    private results: SimulationHDFService,
    private configService: ConfigService,
  ) {
    const env = configService.get('server.env');
    this.endpoints = new Endpoints(env);
  }

  private logger = new Logger(ResultsService.name);

  public async getResults(
    runId: string,
    includeValues = true,
  ): Promise<Results> {
    const timestamps = this.results.getResultsTimestamps(runId);
    const datasets = await this.results.getDatasets(runId);

    const outputs: Output[] = await Promise.all(
      datasets.map(this.parseDataset.bind(this, runId, includeValues)),
    );

    const dates = await timestamps;
    const results: Results = {
      simId: runId,
      outputs: outputs,
      created: dates.created ? dates.created.toTimeString() : '',
      updated: dates.updated ? dates.updated.toTimeString() : '',
    };

    return results;
  }

  public async getValues(
    runId: string,
    datasetId: string,
  ): Promise<undefined | (string[] | number[] | boolean[])[]> {
    // The index field will be needed when we are doing slicing of the data so this will need to change

    return (await this.results.getDatasetValues(runId, datasetId))?.value;
  }

  public async download(runId: string): Promise<S3.Body> {
    try {
      const file = await this.storage.getObject(
        this.endpoints.getSimulationRunOutputS3Path(runId),
      );
      if (file.Body) {
        return file.Body;
      } else {
        throw new NotFoundException(
          `Results could not be found for simulation run '${runId}'.`,
        );
      }
    } catch (error) {
      if (error.statusCode === HttpStatus.NOT_FOUND) {
        throw new NotFoundException(
          `Results could not be found for simulation run '${runId}'.`,
        );
      } else {
        throw error;
      }
    }
  }

  public async getOutput(
    runId: string,
    reportId: string,
    includeData = false,
  ): Promise<Output> {
    const dataset = await this.results.getDatasetbyId(runId, reportId);
    if (dataset) {
      return this.parseDataset(runId, includeData, dataset);
    }
    throw new Error('Output Not Found');
  }

  private async parseDataset(
    runId: string,
    includeValues: boolean,
    dataset: Dataset,
  ): Promise<Output> {
    const data: OutputData[] = [];
    const sedIds = dataset.attributes.sedmlDataSetIds as string[];
    const sedLabels = dataset.attributes.sedmlDataSetLabels as string[];
    const sedShapes = dataset.attributes.sedmlDataSetShapes as string[];
    const sedTypes = dataset.attributes.sedmlDataSetDataTypes as string[];
    const sedNames = dataset.attributes.sedmlDataSetNames as string[];

    const values = includeValues
      ? (await this.getValues(runId, dataset.id)) || []
      : [];

    const consistent =
      sedIds.length == sedLabels.length &&
      sedIds.length == sedShapes.length &&
      sedIds.length == sedTypes.length &&
      sedIds.length == sedNames.length &&
      ((includeValues && sedIds.length == values.length) || !includeValues);

    if (!consistent) {
      this.logger.error(
        'Error parsing data due to inconsistent atributes and values. Recieved ids, labels, shapes, names,types:',
      );
      this.logger.error(sedIds);
      this.logger.error(sedLabels);
      this.logger.error(sedShapes);
      this.logger.error(sedNames);
      this.logger.error(sedTypes);
      this.logger.error(values.length);
      throw new Error('Cannot process data');
    }

    sedIds.forEach((sedId, index) => {
      // These accesses by index should work, but this *feels* unsafe.
      // The above check should help, but add more checking and error handling here
      const output: OutputData = {
        id: sedId,
        label: sedLabels[index],
        shape: sedShapes[index],
        type: sedTypes[index],
        name: sedNames[index],
        values: values[index] || [],
      };
      data.push(output);
    });

    const ret: Output = {
      simId: runId,
      outputId: dataset.attributes.uri,
      name: dataset.attributes.sedmlName,
      type: dataset.attributes._type,
      data: data,
      created: dataset.created ? dataset.created.toTimeString() : '',
      updated: dataset.updated ? dataset.updated.toTimeString() : '',
    };

    return ret;
  }

  public async deleteSimulationRunResults(runId: string): Promise<void> {
    await this.results.deleteDatasets(runId);
    await this.storage.deleteObject(
      this.endpoints.getSimulationRunOutputS3Path(runId),
    );
  }
}
