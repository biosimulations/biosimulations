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
  InlineResponse20010,
} from '@biosimulations/hdf5apiclient';
import {
  BiosimulationsDataAtributes,
  Dataset,
  isArrayAttribute,
  isStringAttribute,
} from './datamodel';

const ACCEPT = 'application/json';
const DATASET = 'datasets';
const AUTH = undefined;
const GROUP = 'groups';
Injectable();
export class SimulationHDFService {
  private logger = new Logger(SimulationHDFService.name);

  public constructor(
    @Inject(DatasetService) private datasetService: DatasetService,
    @Inject(DomainService) private domainService: DomainService,
    @Inject(GroupService) private groupService: GroupService,
    @Inject(AttributeService) private attrbuteService: AttributeService,
    @Inject(LinkService) private linkService: LinkService,
  ) {}

  public async getDatasetValues(
    simId: string,
    datasetId: string,
  ): Promise<InlineResponse20010> {
    const domain = this.getDomainName(simId);
    const dataResponse = await this.datasetService
      .datasetsIdValueGet(
        datasetId,
        domain,
        undefined,
        undefined,
        undefined,
        ACCEPT,
      )
      .toPromise();
    const data: InlineResponse20010 = dataResponse.data;
    return data;
  }
  public async getResultsTimestamps(
    simId: string,
  ): Promise<{ created?: Date; updated?: Date }> {
    const domain = simId + '.results';
    const root_id = await this.getRootGroupId(domain);
    if (root_id) {
      const metadata = await this.getGroup(domain, root_id);
      if (metadata.created && metadata.lastModified) {
        return {
          created: this.createDate(metadata.created),
          updated: this.createDate(metadata.lastModified),
        };
      }
    }
    return { created: undefined, updated: undefined };
  }

  public async getDatasetbyId(
    simId: string,
    reportId: string,
  ): Promise<Dataset | undefined> {
    const datasets = await this.getDatasets(simId);
    datasets.filter((value) => value.attributes.sedmlId == reportId);

    return datasets[0];
  }
  public async getDatasets(simId: string): Promise<Dataset[]> {
    const domain = this.getDomainName(simId);

    const response = await this.domainService
      .datasetsGet('application/json', domain)
      .toPromise();

    const datasetIds = response.data.datasets || [];

    // List of attrbute ids for each dataset
    const datasetAttributeIds: (keyof BiosimulationsDataAtributes)[][] =
      await Promise.all(
        datasetIds.map((datasetId: string) =>
          this.getDatasetAttributeIds(domain, datasetId),
        ),
      );
    const datasetAttributes = await Promise.all(
      (
        await datasetAttributeIds
      ).map(async (attributeIds, index) => {
        const attributes: BiosimulationsDataAtributes = {
          _type: '',
          uri: '',
          sedmlId: '',
          sedmlName: '',
          sedmlDataSetDataTypes: [],
          sedmlDataSetIds: [],
          sedmlDataSetNames: [],
          sedmlDataSetShapes: [],
          sedmlDataSetLabels: [],
        };
        for (const attribute of attributeIds) {
          const value = await this.getDatasetAttributeValue(
            domain,
            datasetIds[index],
            attribute,
          );
          if (isStringAttribute(attribute)) {
            attributes[attribute] = value as string;
          } else if (isArrayAttribute(attribute)) {
            attributes[attribute] = value as string[];
          }
        }
        return attributes;
      }),
    );

    const datasets = Promise.all(
      datasetAttributes.map(async (value, index) => {
        const dataset = await this.getDataset(domain, datasetIds[index]);
        const datasetReturn = {
          uri: value.uri,
          id: datasetIds[index],
          created: this.createDate(dataset.created),
          updated: this.createDate(dataset.lastModified),
          attributes: value,
        };
        return datasetReturn;
      }),
    );
    return datasets;
  }

  private createDate(timestamp: number | undefined): Date | undefined {
    // HSDS defines dates as seconds since epoch. Date() takes ms.
    if (timestamp) {
      return new Date(timestamp * 1000);
    } else {
      return undefined;
    }
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
  ): Promise<string | string[]> {
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
      return uriResponse.data.value || '';
    } catch (e) {
      this.logger.error('error for attribute' + attribute);
      return '';
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
