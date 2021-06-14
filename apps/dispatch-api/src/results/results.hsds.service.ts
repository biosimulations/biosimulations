import { SimulationHDFService } from '@biosimulations/hsds/client';
import { SharedStorageService } from '@biosimulations/shared/storage';
import { Injectable, Logger } from '@nestjs/common';
import { retry } from 'rxjs/operators';
import { Output, OutputData, Results } from './datamodel';
import { ResultsController } from './results.controller';
@Injectable()
export class HSDSResultsService {
  public async getResults(
    simId: string,
    includeValues = true,
  ): Promise<Results> {
    const timestamps = this.results.getResultsTimestamps(simId);
    const datasets = await this.results.getDatasets(simId);

    const outputs: Output[] = await Promise.all(
      datasets.map(async (dataset) => {
        const data: OutputData[] = [];
        const sedIds = dataset.attributes.sedmlDataSetIds as string[];
        const sedLabels = dataset.attributes.sedmlDataSetLabels as string[];
        const sedShapes = dataset.attributes.sedmlDataSetShapes as string[];
        const sedTypes = dataset.attributes.sedmlDataSetDataTypes as string[];
        const sedNames = dataset.attributes.sedmlDataSetNames as string[];
        console.log(dataset.attributes);
        const values = (await this.getValues(simId, dataset.id)) || [];

        const consistent =
          sedIds.length == sedLabels.length &&
          sedIds.length == sedShapes.length &&
          sedIds.length == sedTypes.length &&
          sedIds.length == sedNames.length &&
          sedIds.length == values.length;

        if (!consistent) {
          throw new Error('Cannot process data');
        }

        sedIds.forEach((sedId, index) => {
          // These accesses by index should work, but the *feel* unsafe.
          //The above check should help, but add more checking and error handling here
          const output: OutputData = {
            id: sedId,
            label: sedLabels[index],
            shape: sedShapes[index],
            type: sedTypes[index],
            name: sedNames[index],
            values: values[index],
          };
          data.push(output);
        });

        const ret: Output = {
          simId,
          outputId: dataset.attributes.uri,
          created: dataset.created ? dataset.created.toTimeString() : '',
          updated: dataset.updated ? dataset.updated.toTimeString() : '',
          sedmlId: dataset.attributes.sedmlId,
          name: dataset.attributes.sedmlName,
          type: dataset.attributes._type,
          data: data,
        };

        return ret;
      }),
    );

    const dates = await timestamps;
    const results: Results = {
      simId,
      created: dates.created ? dates.created.toTimeString() : '',
      updated: dates.updated ? dates.updated.toTimeString() : '',
      outputs: outputs,
    };
  }
  public async getValues(
    simId: string,
    datasetId: string,
  ): Promise<undefined | any[]> {
    // The index feild will be needed when we are doing slicing of the data so this will need to change
    return (await this.results.getDatasetValues(simId, datasetId)).value;
  }
  public constructor(
    private storage: SharedStorageService,
    private results: SimulationHDFService,
  ) {}
}
