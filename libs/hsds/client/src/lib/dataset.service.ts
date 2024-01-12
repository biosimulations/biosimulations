import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { DomainService } from '@biosimulations/hdf5/api-client';
import {
  BaseHDF5Visitor,
  DatasetData,
  datasetDataToNjArray,
  DefaultService as SimdataApiService,
  HDF5Dataset,
  HDF5File,
  HDF5Visitor,
  visitHDF5File,
} from '@biosimulations/simdata-api-nest-client';
import { Dataset } from './datamodel';
import { ConfigService } from '@nestjs/config';
import { retryBackoff } from '@biosimulations/rxjs-backoff';
import { firstValueFrom, map, Observable } from 'rxjs';
import { AxiosError, AxiosResponse } from 'axios';
import { DataPaths } from './data-paths/data-paths';

import * as nj from '@d4c/numjs';


Injectable();
export class SimulationHDFService {
  private dataPaths: DataPaths;
  private auth: string;
  private logger = new Logger(SimulationHDFService.name);

  public constructor(
    @Inject(SimdataApiService) private simdataApiService: SimdataApiService,
     @Inject(DomainService) private domainService: DomainService,
     private configService: ConfigService,
  ) {
    const env = this.configService.get('server.env');
    this.dataPaths = new DataPaths();

    const username = this.configService.get('data.username');
    const password = this.configService.get('data.password');
    const authString = Buffer.from(`${username}:${password}`).toString('base64');

    this.auth = 'Basic ' + authString;
  }

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

  public async getResultsTimestamps_simdata(runId: string): Promise<Date> {
    const dateResponse: Observable<Date> = this.simdataApiService.getModified(runId).pipe(
      this.getRetryBackoff(),
      map((response: AxiosResponse<string, any>): Date => {
        return new Date(Date.parse(response.data));
      }),
    );
    return await firstValueFrom(dateResponse);
  }

  public async getDatasetbyId_simdata(runId: string, reportId: string): Promise<Dataset | undefined> {
    const datasets = await this.getDatasets_simdata(runId);
    const filtered = datasets.filter((value) => value.uri == reportId);
    return filtered[0];
  }

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
}
