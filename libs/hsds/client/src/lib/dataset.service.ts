import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
// import {
//   AttributeService,
//   DomainService,
//   GroupService,
//   InlineResponse2003 as HDF5Group,
//   InlineResponse2004Links as HDF5Links,
//   InlineResponse2007 as HDF5Dataset,
//   LinkService,
// } from '@biosimulations/hdf5/api-client';
import {
  DatasetData,
  datasetDataToNjArray, BaseHDF5Visitor, HDF5Visitor, visitHDF5File,
  DefaultService as SimdataApiService, HDF5Dataset, HDF5File,
} from '@biosimulations/simdata-api-nest-client';
import { BiosimulationsDataAtributes, Dataset } from './datamodel';
import { ConfigService } from '@nestjs/config';
import { retryBackoff } from '@biosimulations/rxjs-backoff';
import { firstValueFrom, map, Observable } from 'rxjs';
import { AxiosError, AxiosResponse } from 'axios';

import * as nj from '@d4c/numjs';

const DATASET = 'datasets';
const GROUP = 'groups';

Injectable();
export class SimulationHDFService {
  //private dataPaths: DataPaths;
  private auth: string;
  private logger = new Logger(SimulationHDFService.name);

  public constructor(
    @Inject(SimdataApiService) private simdataApiService: SimdataApiService,
    //@Inject(DatasetService) private datasetService: DatasetService,
    // @Inject(DomainService) private domainService: DomainService,
    // @Inject(GroupService) private groupService: GroupService,
    // @Inject(AttributeService) private attributeService: AttributeService,
    // @Inject(LinkService) private linkService: LinkService,
    private configService: ConfigService,
  ) {
    const env = this.configService.get('server.env');
    // this.dataPaths = new DataPaths();

    const username = this.configService.get('data.username');
    const password = this.configService.get('data.password');
    const authString = Buffer.from(`${username}:${password}`).toString('base64');

    this.auth = 'Basic ' + authString;
  }

  // public async getDatasetValues(runId: string, datasetId: string): Promise<InlineResponse20010 | undefined> {
  //   const domain = this.dataPaths.getSimulationRunResultsDomain(runId);
  //   const dataResponse = await this.datasetService
  //     .datasetsIdValueGet(datasetId, domain, undefined, undefined, undefined, this.auth)
  //     .pipe(
  //       this.getRetryBackoff(),
  //       map((response: AxiosResponse<InlineResponse20010>): AxiosResponse<InlineResponse20010> => {
  //         if (typeof response.data === 'string' || response.data instanceof String) {
  //           response.data = JSON5.parse(response.data as string);
  //         }
  //         return response;
  //       }),
  //     );
  //
  //   const dataResponsePromise = await firstValueFrom(dataResponse);
  //
  //   const data: InlineResponse20010 | undefined = dataResponsePromise.data;
  //   return data;
  // }

  public async getDatasetValues_simdata(runId: string, datasetId: string): Promise<nj.NdArray> {
    this.logger.log(`getDatasetValues_simdata(${runId},${datasetId}):
          calling simdataApiService.readDatasetDatasetsRunIdGet(${runId},${datasetId})`);
    const dataResponse: Observable<nj.NdArray> = this.simdataApiService.readDataset(runId, datasetId)
      .pipe(
        this.getRetryBackoff(),
        map((response: AxiosResponse<DatasetData>): nj.NdArray => {
          return datasetDataToNjArray(response.data);
        }),
      );
    return await firstValueFrom(dataResponse);
  }

  // public async getResultsTimestamps(runId: string): Promise<{ created?: Date; updated?: Date }> {
  //   const domain = this.dataPaths.getSimulationRunResultsDomain(runId);
  //   let root_id = undefined;
  //   try {
  //     root_id = await this.getRootGroupId(domain);
  //   } catch (error) {
  //     this.logger.error(`Could not get timestamps for simulation run '${runId}'`);
  //     if (axios.isAxiosError(error)) {
  //       this.logger.error(error.message);
  //     } else {
  //       this.logger.error(error);
  //     }
  //
  //     return {
  //       created: undefined,
  //       updated: undefined,
  //     };
  //   }
  //
  //   if (root_id) {
  //     const metadata = await this.getGroup(domain, root_id);
  //     if (metadata?.created && metadata?.lastModified) {
  //       return {
  //         created: this.createDate(metadata?.created),
  //         updated: this.createDate(metadata?.lastModified),
  //       };
  //     }
  //   }
  //   return { created: undefined, updated: undefined };
  // }

  public async getResultsTimestamps_simdata(runId: string): Promise<Date> {
    const dateResponse: Observable<Date> = this.simdataApiService.getModified(runId).pipe(
      this.getRetryBackoff(),
      map((response: AxiosResponse<string, any>): Date => {
        return new Date(Date.parse(response.data));
      }),
    );
    return await firstValueFrom(dateResponse);
  }

  public async getDatasetbyId(runId: string, reportId: string): Promise<Dataset | undefined> {
    const datasets = await this.getDatasets(runId);
    const filtered = datasets.filter((value) => value.uri == reportId);
    return filtered[0];
  }

  // public async getDatasets(runId: string): Promise<Dataset[]> {
  //   const domain = this.dataPaths.getSimulationRunResultsDomain(runId);
  //
  //   const response = await this.domainService.datasetsGet(domain, this.auth).toPromise();
  //
  //   const datasetIds = response?.data.datasets || [];
  //
  //   // List of attribute ids for each dataset
  //   const datasetAttributeIds: (keyof BiosimulationsDataAtributes)[][] = await Promise.all(
  //     datasetIds.map((datasetId: string) => this.getDatasetAttributeIds(domain, datasetId)),
  //   );
  //   const datasetAttributes = await Promise.all(
  //     (
  //       await datasetAttributeIds
  //     ).map(async (attributeIds, index) => {
  //       const attributes: BiosimulationsDataAtributes = {
  //         _type: '',
  //         uri: '',
  //         sedmlId: '',
  //         sedmlName: '',
  //         sedmlDataSetDataTypes: [],
  //         sedmlDataSetIds: [],
  //         sedmlDataSetNames: [],
  //         sedmlDataSetShapes: [],
  //         sedmlDataSetLabels: [],
  //       };
  //       for (const attribute of attributeIds) {
  //         const value = await this.getDatasetAttributeValue(domain, datasetIds[index], attribute);
  //         if (isStringAttribute(attribute)) {
  //           attributes[attribute] = value as string;
  //         } else if (isArrayAttribute(attribute)) {
  //           attributes[attribute] = value as string[];
  //         }
  //       }
  //       return attributes;
  //     }),
  //   );
  //
  //   const datasets = Promise.all(
  //     datasetAttributes.map(async (value, index) => {
  //       const dataset = await this.getDataset(domain, datasetIds[index]);
  //       const datasetReturn: Dataset = {
  //         uri: value.uri,
  //         id: datasetIds[index],
  //         created: this.createDate(dataset?.created),
  //         updated: this.createDate(dataset?.lastModified),
  //         attributes: value,
  //       };
  //       return datasetReturn;
  //     }),
  //   );
  //
  //   return datasets;
  // }

  public async getDatasets_simdata(runId: string): Promise<Dataset[]> {
    const hdf5FileObservable: Observable<HDF5File> = this.simdataApiService.getMetadata(runId).pipe(
      this.getRetryBackoff(),
      map((response: AxiosResponse<HDF5File>): HDF5File => {
        return response.data;
      }),
    );
    const hdf5File: HDF5File = await firstValueFrom(hdf5FileObservable);

    // visit the hdf5 file and extract all HDF5Datasets
    const hdf5Datasets: HDF5Dataset[] = [];
    const datasetVisitor: HDF5Visitor = new (class extends BaseHDF5Visitor {
      visitDataset(dataset: HDF5Dataset): void {
        hdf5Datasets.push(dataset);
      }
    })();
    visitHDF5File(hdf5File, datasetVisitor);
    const modified_timestamp: Date = await this.getResultsTimestamps_simdata(runId);
    const datasets: Dataset[] = [];
    for (const hdf5Dataset of hdf5Datasets) {
      const dataset: Dataset = {
        uri: hdf5Dataset.attributes['uri'],
        id: hdf5Dataset.name,
        created: modified_timestamp,
        updated: modified_timestamp,
        attributes: {
          _type: hdf5Dataset.attributes['_type'],
          uri: hdf5Dataset.attributes['uri'],
          sedmlId: hdf5Dataset.attributes['sedmlId'],
          sedmlName: hdf5Dataset.attributes['sedmlName'],
          sedmlDataSetDataTypes: hdf5Dataset.attributes['sedmlDataSetDataTypes'],
          sedmlDataSetIds: hdf5Dataset.attributes['sedmlDataSetIds'],
          sedmlDataSetLabels: hdf5Dataset.attributes['sedmlDataSetLabels'],
          sedmlDataSetNames: hdf5Dataset.attributes['sedmlDataSetNames'],
          sedmlDataSetShapes: hdf5Dataset.attributes['sedmlDataSetShapes'],
        },
      };
      datasets.push(dataset);
    }

    return datasets;
  }


  public async deleteDatasets(runId: string): Promise<void> {
    const domain = this.dataPaths.getSimulationRunResultsDomain(runId);
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

  private getRetryBackoff(): <T>(source: Observable<T>) => Observable<T> {
    const initialInterval = this.configService.get('data.clientInitialInterval');
    const maxRetries = this.configService.get('data.clientMaxRetries');
    return retryBackoff({
      initialInterval: initialInterval,
      maxRetries: maxRetries,
      resetOnSuccess: true,
      shouldRetry: (error: AxiosError): boolean => {
        return (
          error.isAxiosError &&
          [
            HttpStatus.REQUEST_TIMEOUT,
            HttpStatus.INTERNAL_SERVER_ERROR,
            HttpStatus.BAD_GATEWAY,
            HttpStatus.GATEWAY_TIMEOUT,
            HttpStatus.SERVICE_UNAVAILABLE,
            HttpStatus.TOO_MANY_REQUESTS,
            undefined,
            null,
          ].includes(error?.response?.status)
        );
      },
    });
  }
  // private async getGroup(domain: string, id: string): Promise<HDF5Group | undefined> {
  //   const responseObs = await this.groupService.groupsIdGet(id, domain, this.auth).pipe(this.getRetryBackoff());
  //
  //   const response = await firstValueFrom(responseObs);
  //   const data = response?.data;
  //   return data;
  // }

  private async getDataset(domain: string, id: string): Promise<HDF5Dataset | undefined> {
    const responseObs = await this.datasetService.datasetsIdGet(id, domain, this.auth).pipe(this.getRetryBackoff());

    const response = await firstValueFrom(responseObs);
    return response?.data;
  }

  // private async getLinks(groupId: string, domain: string): Promise<HDF5Links[]> {
  //   const linksResponseObs = await this.linkService
  //     .groupsIdLinksGet(groupId, domain, undefined, undefined, this.auth)
  //     .pipe(this.getRetryBackoff());
  //
  //   const linksResponse = await firstValueFrom(linksResponseObs);
  //   return linksResponse?.data.links || [];
  // }

  private async getDatasetAttributeIds(
    domain: string,
    datasetId: string,
  ): Promise<(keyof BiosimulationsDataAtributes)[]> {
    const response = await this.attributeService
      .collectionObjUuidAttributesGet(DATASET, datasetId, this.auth, domain)
      .pipe(this.getRetryBackoff());

    const responsePromise = await firstValueFrom(response);
    const attributes = responsePromise?.data.attributes || [];
    return attributes.map((value) => value.name as keyof BiosimulationsDataAtributes);
  }

  private async getDatasetAttributeValue(
    domain: string,
    datasetId: string,
    attribute: keyof BiosimulationsDataAtributes,
  ): Promise<string | string[]> {
    try {
      const uriResponse = this.attributeService
        .collectionObjUuidAttributesAttrGet(DATASET, datasetId, attribute, this.auth, domain)
        .pipe(this.getRetryBackoff());

      const uriResponsePromise = await firstValueFrom(uriResponse);

      return uriResponsePromise?.data.value || '';
    } catch (e) {
      this.logger.error('error for attribute' + attribute);
      return '';
    }
  }

  // private async getRootGroupId(domain: string): Promise<string | undefined> {
  //   const domainResponse = await this.domainService.rootGet(domain, this.auth).pipe(this.getRetryBackoff());
  //
  //   const domainResponsePromise = await firstValueFrom(domainResponse);
  //   const domainInfo = domainResponsePromise?.data;
  //
  //   const rootGroup = domainInfo?.root;
  //   return rootGroup;
  // }
}
