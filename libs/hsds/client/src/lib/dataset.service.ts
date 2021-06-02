import { Inject, Injectable } from '@nestjs/common';
import { pluck } from 'rxjs/operators';
import {
  AttributeService,
  DatasetService,
  DomainService,
  GroupService,
} from '@biosimulations/hdf5apiclient';

Injectable();
export class SimulationHDFService {
  constructor(
    @Inject(DatasetService) private datasetService: DatasetService,
    @Inject(DomainService) private domainService: DomainService,
    @Inject(GroupService) private groupService: GroupService,
    @Inject(AttributeService) private attrbuteService: AttributeService,
  ) {}
  async getReport(simId: string) {
    const domain = simId + '.results';

    const response = await this.domainService
      .datasetsGet('application/json', domain)
      .toPromise();

    const datasetIds = response.data.datasets;
    const datasetNames = [];
    for (const datasetId of datasetIds) {
      const dataResponse = await this.datasetService
        .datasetsIdGet(datasetId, 'application/json', domain)
        .toPromise();

      datasetNames.push(dataResponse.data);
    }

    return datasetNames;
  }
  public getDatasets(simId: string) {
    return `Simid ${{ simId }} datasets`;
  }
}
