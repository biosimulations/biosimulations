import { SimulationHDFService } from '@biosimulations/hsds/client';
import { SharedStorageService } from '@biosimulations/shared/storage';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class HSDSResultsService {
  public async getResults(simId: string) {
    const timestamps = this.results.getResultsTimestamps(simId);
    const datasets = await this.results.getDatasets(simId);

    const results = [];

    type report = {
      id: string;
      label: string;
      shape: string;
      type: string;
      name: string;
    };
    datasets.forEach((dataset) => {
      const data: report[] = [];
      const sedIds = dataset.attributes.sedmlDataSetIds || [];
      const sedLabels = dataset.attributes.sedmlDataSetLabels || [];
      const sedShapes = dataset.attributes.sedmlDataSetShapes || [];
      const sedTypes = dataset.attributes.sedmlDataSetDataTypes || [];
      const sedNames = dataset.attributes.sedmlDataSetNames || [];
      console.log(dataset.attributes);

      const len1 = sedIds.length;
      const len2 = sedLabels.length;
      const len3 = sedShapes.length;
      const len4 = sedTypes.length;
      const len5 = sedNames.length;
      const consistent =
        sedIds.length == sedLabels.length &&
        sedIds.length == sedShapes.length &&
        sedIds.length == sedTypes.length &&
        sedIds.length == sedNames.length;

      if (!consistent) {
        console.error(
          'Cannot process file due to inconsistent annotation sizes',
        );
        console.error(len1);
        console.error(len2);
        console.error(len3);
        console.error(len4);
        console.error(len5);
      } else {
        sedIds.forEach((sedId, index) => {
          const report = {
            id: sedId,
            label: sedLabels[index],
            shape: sedShapes[index],
            type: sedTypes[index],
            name: sedNames[index],
          };
          data.push(report);
        });
      }

      const result = {
        simId,
        reportId: dataset.attributes.uri,
        created: dataset.created,
        updated: dataset.updated,
        sedmlId: dataset.attributes.sedmlId,
        sedmlName: dataset.attributes.sedmlName,
        type: dataset.attributes._type,
        data,
      };

      results.push(result);
    });

    return {
      simId,
      created: (await timestamps).created,
      updated: (await timestamps).updated,
      reports: results,
    };
  }
  public constructor(
    private storage: SharedStorageService,
    private results: SimulationHDFService,
  ) {}
}
