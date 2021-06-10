import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  AttributeService,
  DatasetService,
  DomainService,
  GroupService,
  InlineResponse2007 as HDF5Dataset,
  InlineResponse2003 as HDF5Group,
  InlineResponse2004Links as HDF5Links,
  LinkService,
} from '@biosimulations/hdf5apiclient';

type BiosimulationsDataAtributes = {
  _type: string;
  uri: string;
  sedmlId: string;
  sedmlName: string;
  sedmlDataSetDataTypes: string[];
  sedmlDataSetIds: string[];
  sedmlDataSetLabels: string[];
  sedmlDataSetNames: string[];
  sedmlDataSetShapes: string[];
};
const ATTRIBUTES: (keyof BiosimulationsDataAtributes)[] = [
  '_type',
  'sedmlId',
  'sedmlName',
  'sedmlDataSetDataTypes',
  'sedmlDataSetIds',
  'sedmlDataSetNames',
  'sedmlDataSetShapes',
  'sedmlDataSetLabels',
];
const ACCEPT = 'application/json';
const DATASET = 'datasets';
const AUTH = undefined;
const GROUP = 'groups';
Injectable();
export class SimulationHDFService {
  private logger = new Logger(SimulationHDFService.name);
  public async getResultsTimestamps(simId: string) {
    const domain = simId + '.results';
    const root_id = await this.getRootGroupId(domain);
    if (root_id) {
      const metadata = await this.getGroup(domain, root_id);
      if (metadata.created && metadata.lastModified) {
        return {
          created: new Date(metadata.created * 1000),
          updated: new Date(metadata.lastModified * 1000),
        };
      }
    }
    return { created: undefined, updated: undefined };
  }

  public constructor(
    @Inject(DatasetService) private datasetService: DatasetService,
    @Inject(DomainService) private domainService: DomainService,
    @Inject(GroupService) private groupService: GroupService,
    @Inject(AttributeService) private attrbuteService: AttributeService,
    @Inject(LinkService) private linkService: LinkService,
  ) {}

  public async getDatasets(simId: string) {
    const domain = this.getDomainName(simId);

    const response = await this.domainService
      .datasetsGet('application/json', domain)
      .toPromise();

    const datasetIds = response.data.datasets || [];
    const datasets = [];
    for (const datasetId of datasetIds) {
      const dataset = this.getDataset(domain, datasetId);
      let attributeNames = await this.getDatasetAttributeIds(domain, datasetId);
      const logger = new Logger('test');
      logger.error(attributeNames);
      attributeNames = ATTRIBUTES;
      logger.error(attributeNames);
      const attributes = {};
      for (const attribute of attributeNames) {
        const value = await this.getDatasetAttributeValue(
          domain,
          datasetId,
          attribute,
        );

        attributes[attribute] = value;
      }

      datasets.push({
        uri: attributes['uri'],
        id: datasetId,
        created: (await dataset).created,
        updated: (await dataset).lastModified,
        attributes: attributes,
      });
    }

    return datasets;
  }

  private getDomainName(simId: string): string {
    return simId + '.results';
  }

  private async getGroup(domain: string, id: string): Promise<HDF5Group> {
    const response = await this.groupService
      .groupsIdGet(id, ACCEPT, domain)
      .toPromise();
    const data = response.data;
    return data;
  }

  private async getDataset(domain: string, id: string): Promise<HDF5Dataset> {
    const response = await this.datasetService
      .datasetsIdGet(id, ACCEPT, domain)
      .toPromise();
    return response.data;
  }

  private async getLinks(
    groupId: string,
    domain: string,
  ): Promise<HDF5Links[]> {
    const linksResponse = await this.linkService
      .groupsIdLinksGet(groupId, ACCEPT, domain)
      .toPromise();
    return linksResponse.data.links || [];
  }

  private async getDatasetAttributeIds(
    domain: string,
    datasetId: string,
  ): Promise<(keyof BiosimulationsDataAtributes)[]> {
    const response = await this.attrbuteService
      .collectionObjUuidAttributesGet(ACCEPT, DATASET, datasetId, AUTH, domain)
      .toPromise();
    const attributes = response.data.attributes || [];
    return attributes.map(
      (value) => value.name as keyof BiosimulationsDataAtributes,
    );
  }

  private async getDatasetAttributeValue(
    domain: string,
    datasetId: string,
    attribute: keyof BiosimulationsDataAtributes,
  ): Promise<(string & string[]) | undefined> {
    try {
      const uriResponse = await this.attrbuteService
        .collectionObjUuidAttributesAttrGet(
          ACCEPT,
          DATASET,
          datasetId,
          attribute,
          AUTH,
          domain,
        )
        .toPromise();

      // This must be hillariously wrong. I am unsure how to get this typed properly. We know the names of the attributes, and the types of each value.
      return uriResponse.data.value as string & string[];
    } catch (e) {
      this.logger.error('error for attribute' + attribute);
      return 'Testname';
    }
  }
  private async getRootGroupId(domain: string): Promise<string | undefined> {
    const domainResponse = await this.domainService
      .rootGet(ACCEPT, domain)
      .toPromise();

    const domainInfo = domainResponse.data;

    const rootGroup = domainInfo.root;
    return rootGroup;
  }
}
