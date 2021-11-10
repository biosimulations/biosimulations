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
} from '@biosimulations/hdf5/api-client';
import {
  BiosimulationsDataAtributes,
  Dataset,
  isArrayAttribute,
  isStringAttribute,
} from './datamodel';
import { Endpoints } from '@biosimulations/config/common';
import { ConfigService } from '@nestjs/config';
import { retryBackoff } from 'backoff-rxjs';
import { firstValueFrom } from 'rxjs';
const DATASET = 'datasets';
const GROUP = 'groups';

// TODO connect to env
const MAX_RETRIES = 12;
const RetryBackoff = retryBackoff({
  initialInterval: 100,
  maxRetries: MAX_RETRIES,
  resetOnSuccess: true,
});

Injectable();
export class SimulationHDFService {
  private endpoints: Endpoints;
  private auth: string;
  private logger = new Logger(SimulationHDFService.name);

  public constructor(
    @Inject(DatasetService) private datasetService: DatasetService,
    @Inject(DomainService) private domainService: DomainService,
    @Inject(GroupService) private groupService: GroupService,
    @Inject(AttributeService) private attributeService: AttributeService,
    @Inject(LinkService) private linkService: LinkService,
    private configService: ConfigService,
  ) {
    const env = this.configService.get('server.env');
    this.endpoints = new Endpoints(env);

    const username = this.configService.get('data.username');
    const password = this.configService.get('data.password');
    this.auth = 'Basic ' + btoa(`${username}:${password}`);
  }

  public async getDatasetValues(
    runId: string,
    datasetId: string,
  ): Promise<InlineResponse20010 | undefined> {
    const domain = this.endpoints.getSimulationRunResultsHsdsDomain(runId);
    const dataResponse = await this.datasetService
      .datasetsIdValueGet(
        datasetId,
        domain,
        undefined,
        undefined,
        undefined,
        this.auth,
      )
      .pipe(RetryBackoff);

    const dataResponsePromise = await firstValueFrom(dataResponse);

    const data: InlineResponse20010 | undefined = dataResponsePromise.data;
    return data;
  }

  public async getResultsTimestamps(
    runId: string,
  ): Promise<{ created?: Date; updated?: Date }> {
    const domain = this.endpoints.getSimulationRunResultsHsdsDomain(runId);
    const root_id = await this.getRootGroupId(domain);
    if (root_id) {
      const metadata = await this.getGroup(domain, root_id);
      if (metadata?.created && metadata?.lastModified) {
        return {
          created: this.createDate(metadata?.created),
          updated: this.createDate(metadata?.lastModified),
        };
      }
    }
    return { created: undefined, updated: undefined };
  }

  public async getDatasetbyId(
    runId: string,
    reportId: string,
  ): Promise<Dataset | undefined> {
    const datasets = await this.getDatasets(runId);
    const filtered = datasets.filter((value) => value.uri == reportId);
    return filtered[0];
  }

  public async getDatasets(runId: string): Promise<Dataset[]> {
    const domain = this.endpoints.getSimulationRunResultsHsdsDomain(runId);

    const response = await this.domainService.datasetsGet(domain).toPromise();

    const datasetIds = response?.data.datasets || [];

    // List of attribute ids for each dataset
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
          created: this.createDate(dataset?.created),
          updated: this.createDate(dataset?.lastModified),
          attributes: value,
        };
        return datasetReturn;
      }),
    );

    return datasets;
  }

  public async deleteDatasets(runId: string): Promise<void> {
    const domain = this.endpoints.getSimulationRunResultsHsdsDomain(runId);
    await this.domainService.rootDelete(domain, this.auth);
  }

  private createDate(timestamp: number | undefined): Date | undefined {
    // HSDS defines dates as seconds since epoch. Date() takes ms.
    if (timestamp) {
      return new Date(timestamp * 1000);
    } else {
      return undefined;
    }
  }

  private async getGroup(
    domain: string,
    id: string,
  ): Promise<HDF5Group | undefined> {
    const responseObs = await this.groupService
      .groupsIdGet(id, domain)
      .pipe(RetryBackoff);

    const response = await firstValueFrom(responseObs);
    const data = response?.data;
    return data;
  }

  private async getDataset(
    domain: string,
    id: string,
  ): Promise<HDF5Dataset | undefined> {
    const responseObs = await this.datasetService
      .datasetsIdGet(id, domain)
      .pipe(RetryBackoff);

    const response = await firstValueFrom(responseObs);
    return response?.data;
  }

  private async getLinks(
    groupId: string,
    domain: string,
  ): Promise<HDF5Links[]> {
    const linksResponseObs = await this.linkService
      .groupsIdLinksGet(groupId, domain)
      .pipe(RetryBackoff);

    const linksResponse = await firstValueFrom(linksResponseObs);
    return linksResponse?.data.links || [];
  }

  private async getDatasetAttributeIds(
    domain: string,
    datasetId: string,
  ): Promise<(keyof BiosimulationsDataAtributes)[]> {
    const response = await this.attributeService
      .collectionObjUuidAttributesGet(DATASET, datasetId, this.auth, domain)
      .pipe(RetryBackoff);

    const responsePromise = await firstValueFrom(response);
    const attributes = responsePromise?.data.attributes || [];
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
      const uriResponse = this.attributeService
        .collectionObjUuidAttributesAttrGet(
          DATASET,
          datasetId,
          attribute,
          this.auth,
          domain,
        )
        .pipe(RetryBackoff);

      const uriResponsePromise = await firstValueFrom(uriResponse);

      return uriResponsePromise?.data.value || '';
    } catch (e) {
      this.logger.error('error for attribute' + attribute);
      return '';
    }
  }

  private async getRootGroupId(domain: string): Promise<string | undefined> {
    const domainResponse = await this.domainService
      .rootGet(domain)
      .pipe(RetryBackoff);

    const domainResponsePromise = await firstValueFrom(domainResponse);
    const domainInfo = domainResponsePromise?.data;

    const rootGroup = domainInfo?.root;
    return rootGroup;
  }
}
