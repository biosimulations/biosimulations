import { Dataset, SimulationHDFService } from '@biosimulations/simdata-api/nest-client-wrapper';
import { SimulationStorageService } from '@biosimulations/shared/storage';
import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
  HttpStatus,
} from '@nestjs/common';
import { isOutputParsingError, Output, OutputData, OutputParsingError, Results } from './datamodel';
import { SimulationRunOutputDatumElement } from '@biosimulations/datamodel/common';
import { AWSError, S3 } from 'aws-sdk';
import { Endpoints } from '@biosimulations/config/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { NdArray } from '@d4c/numjs';

interface OutputResult {
  dataset: Dataset;
  succeeded: boolean;
  value?: Output;
  error?: string;
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

  public async getResults(runId: string, includeValues = true): Promise<Results> {
    const timestamp = this.results.getResultsTimestamps(runId);

    const datasets = await this.results.getDatasets(runId).catch((error) => {
      this.logger.error('Error retrieving datasets');
      if (axios.isAxiosError(error)) {
        this.logger.error(error.message);
        if (error.response?.status == 404) {
          throw new NotFoundException(`Results could not be found for simulation run '${runId}'.`);
        } else {
          throw error;
        }
      } else {
        throw error;
      }
    });

    const outputResults: OutputResult[] = await Promise.all(
      datasets.map((dataset: Dataset): Promise<OutputResult> => {
        return this.parseDataset(runId, includeValues, dataset)
          .then((value: Output | OutputParsingError): OutputResult => {
            if (isOutputParsingError(value)) {
              return {
                dataset,
                succeeded: false,
                error: value.errorSummary,
              };
            }
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
        const errorMsg = outputResult?.error;

        errorDetails.push(
          `${datasetAttrs._type} '${datasetAttrs.uri} of simulation run '${runId}' could not be parsed: ${errorMsg}.`,
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

    const date = await timestamp;
    const results: Results = {
      simId: runId,
      outputs: outputs,
      created: date ? date.toTimeString() : '',
      updated: date ? date.toTimeString() : '',
    };

    return results;
  }

  public async download(runId: string): Promise<S3.Body> {
    try {
      const file = await this.simStorage.getSimulationRunOutputArchive(runId);

      if (file.Body) {
        return file.Body;
      } else {
        throw new NotFoundException(`Results could not be found for simulation run '${runId}'.`);
      }
    } catch (error) {
      if ((error as AWSError).statusCode === HttpStatus.NOT_FOUND) {
        throw new NotFoundException(`Results could not be found for simulation run '${runId}'.`);
      } else {
        throw error;
      }
    }
  }

  public async getOutput(runId: string, reportId: string, includeData = false): Promise<Output> {
    const dataset = await this.results.getDatasetbyId(runId, reportId);
    if (dataset) {
      const parsedDataset = await this.parseDataset(runId, includeData, dataset);
      if (!isOutputParsingError(parsedDataset)) {
        return parsedDataset;
      } else {
        throw new InternalServerErrorException(parsedDataset.errorSummary);
      }
    }
    throw new BadRequestException('Output Not Found');
  }

  /**
   *
   * @param runId The id of the simulation run
   * @param outputUri The uri of the dataset. This is used to give a human readable error message
   * @param datasetId  The id of the dataset to get values of. This is used as the lookup key
   * @returns Simulation Run output or an OutputParsingError if the output could not be retrieved
   */
  private async getValues(
    runId: string,
    outputUri: string,
    datasetId: string,
  ): Promise<SimulationRunOutputDatumElement[][] | OutputParsingError> {
    // The index field will be needed when we are doing slicing of the data so this will need to change
    try {
      const response: NdArray = await this.results.getDatasetValues(runId, datasetId);
      if (response) {
        if (response.shape.length != 2) {
          throw Error(`The shape of the dataset '${outputUri}' is not 2d`);
        } else {
          // rewrite the following using numjs
          const shape = response.shape;
          const array: SimulationRunOutputDatumElement[][] = [];
          for (let i = 0; i < shape[0]; i++) {
            const row: SimulationRunOutputDatumElement[] = [];
            for (let j = 0; j < shape[1]; j++) {
              row.push(response.get(i,j));
            }
            array.push(row);
          }
          return array;
        }
      } else {
        throw Error(`No values found for ${outputUri}`);
      }
    } catch (error) {
      const errPrefix = `Error getting values for output '${outputUri}' of simulation run '${runId}'`;
      const errMsg = axios.isAxiosError(error) ? `${errPrefix}: ${error.message}` : `${errPrefix}: ${error}`;

      return {
        simId: runId,
        outputId: outputUri,
        errorSummary: errMsg,
      };
    }
  }

  /**
   * Parse the raw dataset from simdata-api and return an Output object. Checks for consistency of the hdf5 attributes
   *
   * @param runId
   * @param includeValues
   * @param dataset
   * @returns Output object. If errors occur, return an OutputParsingError object.
   */
  private async parseDataset(
    runId: string,
    includeValues: boolean,
    dataset: Dataset,
  ): Promise<Output | OutputParsingError> {
    const data: OutputData[] = [];
    const sedIds = dataset.attributes.sedmlDataSetIds as string[];
    const sedLabels = dataset.attributes.sedmlDataSetLabels as string[];
    const sedShapes = dataset.attributes.sedmlDataSetShapes as string[];
    const sedTypes = dataset.attributes.sedmlDataSetDataTypes as string[];
    const sedNames = dataset.attributes.sedmlDataSetNames as string[];

    const values = includeValues ? await this.getValues(runId, dataset.attributes.uri, dataset.id) : [];

    const consistent =
      sedIds.length == sedLabels.length &&
      sedIds.length == sedShapes.length &&
      sedIds.length == sedTypes.length &&
      sedIds.length == sedNames.length &&
      ((includeValues && !isOutputParsingError(values) && sedIds.length == values.length) || !includeValues);

    if (!consistent || isOutputParsingError(values)) {
      const summary =
        `${dataset.attributes._type} '${dataset.attributes.uri}' from simulation run '${runId}' \
        could not be parsed due to values and attributes with inconsistent sizes.` +
        `\n` +
        `\n  values: ${
          isOutputParsingError(values) ? 'Error retrieving values:' + values.errorSummary : values.length
        }` +
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

      return {
        simId: runId,
        outputId: dataset.attributes.uri,
        type: dataset.attributes._type,
        name: dataset.attributes.sedmlName,
        errorSummary: summary,
      };
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
