import { Inject, Injectable } from '@nestjs/common';
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

type BiosimulationsDataAttribute =
  | '_type'
  | 'uri'
  | 'sedmlDataSetDataTypes'
  | 'sedmlDataSetIds'
  | 'sedmlDataSetLabels'
  | 'sedmlDataSetNames'
  | 'sedmlDataSetShapes'
  | 'sedmlId'
  | 'sedmlName';

const ACCEPT = 'application/json';
const DATASET = 'datasets';
const AUTH = undefined;
const GROUP = 'groups';
Injectable();
export class SimulationHDFService {
  public async getMetadata(simId: string) {
    const domain = simId + '.results';
    const root_id = await this.getRootGroupId(domain);
    if (root_id) {
      const metadata = await this.getGroup(domain, root_id);
      return metadata;
    } else {
      return undefined;
    }
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
      const dataset = await this.getDataset(domain, datasetId);
      const attributeNames = await this.getDatasetAttributeIds(
        domain,
        datasetId,
      );
      const attributes: { [name in BiosimulationsDataAttribute]?: string } = {};
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
        created: dataset.created,
        updated: dataset.lastModified,
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
  ): Promise<BiosimulationsDataAttribute[]> {
    const response = await this.attrbuteService
      .collectionObjUuidAttributesGet(ACCEPT, DATASET, datasetId, AUTH, domain)
      .toPromise();
    const attributes = response.data.attributes || [];
    return attributes.map((value) => value.name as BiosimulationsDataAttribute);
  }

  private async getDatasetAttributeValue(
    domain: string,
    datasetId: string,
    attribute: BiosimulationsDataAttribute,
  ): Promise<string | undefined> {
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
    return uriResponse.data.value;
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
