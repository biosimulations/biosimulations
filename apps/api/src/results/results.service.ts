import { Dataset, SimulationHDFService } from '@biosimulations/hsds/client';
import { SimulationStorageService } from '@biosimulations/shared/storage';
import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
  HttpStatus,
} from '@nestjs/common';
import { Output, OutputData, Results } from './datamodel';
import { SimulationRunOutputDatumElement } from '@biosimulations/datamodel/common';
import { AWSError, S3 } from 'aws-sdk';
import { Endpoints } from '@biosimulations/config/common';
import { ConfigService } from '@nestjs/config';

interface OutputResult {
  dataset: Dataset;
  succeeded: boolean;
  value?: Output;
  error?: any;
}

@Injectable()
export class ResultsService {
  private endpoints: Endpoints;

  public constructor(
    private simStorage: SimulationStorageService,
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

    const outputResults: OutputResult[] = await Promise.all(
      datasets.map((dataset: Dataset): Promise<OutputResult> => {
        return this.parseDataset(runId, includeValues, dataset)
          .then((value: Output): OutputResult => {
            return {
              dataset: dataset,
              succeeded: true,
              value: value,
            };
          })
          .catch((error: any): OutputResult => {
            return {
              dataset: dataset,
              succeeded: false,
              error: error,
            };
          });
      }),
    );

    const outputs: Output[] = [];
    const errorDetails: string[] = [];
    const errorSummaries: string[] = [];
    outputResults.forEach((outputResult: OutputResult): void => {
      if (outputResult.succeeded && outputResult.value) {
        outputs.push(outputResult.value);
      } else {
        const datasetAttrs = outputResult.dataset.attributes;
        const error = outputResult?.error;
        const errorMsg = error?.isAxiosError 
          ? `${
              error?.response?.status
            }: ${error?.response?.data?.detail || error?.response?.statusText}`
          : `${error?.status || error?.statusCode}: ${error?.message}`;
        errorDetails.push(
          `${datasetAttrs._type} '${
            datasetAttrs.uri
          } of simulation run '${runId}' could not be parsed: ${errorMsg}.`,
        );
        errorSummaries.push(
          `${datasetAttrs._type} '${datasetAttrs.uri} of simulation run '${runId}' could not be parsed.`,
        );
      }
    });

    if (errorDetails.length) {
      this.logger.error(
        `${errorDetails.length} outputs could not be parsed for simulation run ${runId}:` +
          `\n\n  ${errorDetails.join('\n\n').replace(/\n/g, '\n  ')}`,
      );
      throw new InternalServerErrorException(
        `${errorSummaries.length} outputs could not be parsed for simulation run ${runId}:` +
          `\n\n  ${errorSummaries.join('\n\n').replace(/\n/g, '\n  ')}`,
      );
    }

    const dates = await timestamps;
    const results: Results = {
      simId: runId,
      outputs: outputs,
      created: dates.created ? dates.created.toTimeString() : '',
      updated: dates.updated ? dates.updated.toTimeString() : '',
    };

    return results;
  }

  private async getValues(
    runId: string,
    outputUri: string,
    datasetId: string,
  ): Promise<SimulationRunOutputDatumElement[][]> {
    // The index field will be needed when we are doing slicing of the data so this will need to change

    const response = await this.results.getDatasetValues(runId, datasetId);
    if (response && 'value' in response) {
      return response.value as SimulationRunOutputDatumElement[][];
    } else {
      throw new InternalServerErrorException(
        `Results could not be found for output '${outputUri}' of simulation run '${runId}'.`,
      );
    }
  }

  public async download(runId: string): Promise<S3.Body> {
    try {
      const file = await this.simStorage.getSimulationRunOutputArchive(runId);

      if (file.Body) {
        return file.Body;
      } else {
        throw new NotFoundException(
          `Results could not be found for simulation run '${runId}'.`,
        );
      }
    } catch (error) {
      if ((error as AWSError).statusCode === HttpStatus.NOT_FOUND) {
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
    throw new BadRequestException('Output Not Found');
  }

  public async deleteSimulationRunResults(runId: string): Promise<void> {
    await this.results.deleteDatasets(runId);
    await this.simStorage.deleteSimulationRunResults(runId);
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
      ? await this.getValues(runId, dataset.attributes.uri, dataset.id)
      : [];

    const consistent =
      sedIds.length == sedLabels.length &&
      sedIds.length == sedShapes.length &&
      sedIds.length == sedTypes.length &&
      sedIds.length == sedNames.length &&
      ((includeValues && sedIds.length == values.length) || !includeValues);

    if (!consistent) {
      const summary =
        `${dataset.attributes._type} '${dataset.attributes.uri}' from simulation run '${runId}' could not be parsed due to values and attributes with inconsistent sizes.` +
        `\n` +
        `\n  values: ${values.length}` +
        `\n  ids: ${sedIds.length}` +
        `\n  labels: ${sedLabels.length}` +
        `\n  names: ${sedNames.length}` +
        `\n  shapes: ${sedShapes.length}` +
        `\n  types: ${sedTypes.length}`;
      this.logger.error(
        summary +
          `\n` +
          `\n  values: ${values}` +
          `\n  ids: ${sedIds}` +
          `\n  labels: ${sedLabels}` +
          `\n  names: ${sedNames}` +
          `\n  shapes: ${sedShapes}` +
          `\n  types: ${sedTypes}`,
      );
      throw new BadRequestException(summary);
    }

    sedIds.forEach((sedId, index) => {
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
}
