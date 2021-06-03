import { Inject, Injectable } from '@nestjs/common';
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
  async getDatasets(simId: string) {
    const domain = simId + '.results';

    const response = await this.domainService
      .datasetsGet('application/json', domain)
      .toPromise();

    const datasetIds = response.data.datasets ||  [];
    const datasetNames = [];
    for (const datasetId of datasetIds) {
      const dataResponse = await this.datasetService
        .datasetsIdGet(datasetId, 'application/json', domain)
        .toPromise();
      const datasetAttributes = await this.attrbuteService.collectionObjUuidAttributesGet("application/json","datasets",datasetId,undefined,domain).toPromise()
      const datasetIdResponse = await this.attrbuteService.collectionObjUuidAttributesAttrGet("application/json", "datasets", datasetId, "id", undefined, domain).toPromise()
      const datasetIdName = datasetIdResponse.data
      datasetNames.push(dataResponse.data);
    }

    return datasetNames;
  }

}
