import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
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

import * as nj from '@d4c/numjs';

Injectable();
export class SimulationHDFService {
  private logger = new Logger(SimulationHDFService.name);

  public constructor(
    @Inject(SimdataApiService) private simdataApiService: SimdataApiService,
    private configService: ConfigService,
  ) {
  }

  public async getDatasetValues(runId: string, datasetId: string): Promise<nj.NdArray> {
    this.logger.log(`getDatasetValues(${runId},${datasetId}):
          calling simdataApiService.readDatasetDatasetsRunIdGet(${runId},${datasetId})`);
    const dataResponse: Observable<nj.NdArray> = this.simdataApiService.readDataset(runId, datasetId).pipe(
      this.getRetryBackoff(),
      map((response: AxiosResponse<DatasetData>): nj.NdArray => {
        return datasetDataToNjArray(response.data);
      }),
    );
    return await firstValueFrom(dataResponse);
  }

  public async getResultsTimestamps(runId: string): Promise<Date> {
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

  public async getDatasets(runId: string): Promise<Dataset[]> {
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
    const modified_timestamp: Date = await this.getResultsTimestamps(runId);
    const datasets: Dataset[] = [];
    for (const hdf5Dataset of hdf5Datasets) {
      const attributes = hdf5Dataset.attributes;

      const _type = attributes.find((attr) => attr.key == '_type')?.value as string;
      const uri = attributes.find((attr) => attr.key == 'uri')?.value as string;
      const sedmlId = attributes.find((attr) => attr.key == 'sedmlId')?.value as string;
      const sedmlName = attributes.find((attr) => attr.key == 'sedmlName')?.value as string;
      const sedmlDataSetDataTypes = attributes.find((attr) => attr.key == 'sedmlDataSetDataTypes')?.value as string[];
      const sedmlDataSetIds = attributes.find((attr) => attr.key == 'sedmlDataSetIds')?.value as string[];
      const sedmlDataSetNames = attributes.find((attr) => attr.key == 'sedmlDataSetNames')?.value as string[];
      const sedmlDataSetShapes = attributes.find((attr) => attr.key == 'sedmlDataSetShapes')?.value as string[];
      const sedmlDataSetLabels = attributes.find((attr) => attr.key == 'sedmlDataSetLabels')?.value as string[];

      const dataset: Dataset = {
        uri: uri || '',
        id: hdf5Dataset.name,
        created: modified_timestamp,
        updated: modified_timestamp,
        attributes: {
          _type: _type || '',
          uri: uri || '',
          sedmlId: sedmlId || '',
          sedmlName: sedmlName || '',
          sedmlDataSetDataTypes: sedmlDataSetDataTypes || [],
          sedmlDataSetIds: sedmlDataSetIds || [],
          sedmlDataSetLabels: sedmlDataSetLabels || [],
          sedmlDataSetNames: sedmlDataSetNames || [],
          sedmlDataSetShapes: sedmlDataSetShapes || [],
        },
      };
      datasets.push(dataset);
    }

    return datasets;
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
