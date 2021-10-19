import { Dataset, SimulationHDFService } from '@biosimulations/hsds/client';
import { SharedStorageService } from '@biosimulations/shared/storage';
import { Injectable, Logger } from '@nestjs/common';
import { Output, OutputData, Results } from './datamodel';
import { S3 } from 'aws-sdk';

@Injectable()
export class ResultsService {
  public constructor(
    private storage: SharedStorageService,
    private results: SimulationHDFService,
  ) {}
  private logger = new Logger(ResultsService.name);
  public async getResults(
    simId: string,
    includeValues = true,
  ): Promise<Results> {
    const timestamps = this.results.getResultsTimestamps(simId);
    const datasets = await this.results.getDatasets(simId);

    const outputs: Output[] = await Promise.all(
      datasets.map(this.parseDataset.bind(this, simId, includeValues)),
    );

    const dates = await timestamps;
    const results: Results = {
      simId,
      created: dates.created ? dates.created.toTimeString() : '',
      updated: dates.updated ? dates.updated.toTimeString() : '',
      outputs: outputs,
    };

    return results;
  }
  public async getValues(
    simId: string,
    datasetId: string,
  ): Promise<undefined | (string[] | number[] | boolean[])[]> {
    // The index feild will be needed when we are doing slicing of the data so this will need to change
    // TODO update the hsds client to use the correct name "value" not "values"
    return ((await this.results.getDatasetValues(simId, datasetId)) as any)
      ?.value;
  }

  public async download(simId: string): Promise<S3.Body | undefined> {
    const file = await this.storage.getObject(
      'simulations/' + simId + '/' + simId + '.zip',
    ); // TODO remove harcoded path
    return file.Body;
  }

  public async getOutput(
    simId: string,
    reportId: string,
    includeData = false,
  ): Promise<Output> {
    const dataset = await this.results.getDatasetbyId(simId, reportId);
    if (dataset) {
      return this.parseDataset(simId, includeData, dataset);
    }
    throw new Error('Output Not Found');
  }

  private async parseDataset(
    simId: string,
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
      ? (await this.getValues(simId, dataset.id)) || []
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
      //The above check should help, but add more checking and error handling here
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
      simId,
      outputId: dataset.attributes.uri,
      created: dataset.created ? dataset.created.toTimeString() : '',
      updated: dataset.updated ? dataset.updated.toTimeString() : '',
      name: dataset.attributes.sedmlName || dataset.attributes.sedmlId,
      type: dataset.attributes._type,
      data: data,
    };

    return ret;
  }
}
