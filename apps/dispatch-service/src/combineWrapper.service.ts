import {
  BioSimulationsCombineArchiveElementMetadata,
  CombineArchiveManifest,
  CombineArchiveSedDocSpecs,
  SimulationProjectsService,
} from '@biosimulations/combine-api-client';
import { Injectable, HttpStatus } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { retryBackoff } from 'backoff-rxjs';

@Injectable()
export class CombineWrapperService {
  public constructor(private service: SimulationProjectsService) {    
  }

  private getRetryBackoff(): <T>(source: Observable<T>) => Observable<T> {
    return retryBackoff({
      initialInterval: 100,
      maxRetries: 12,
      resetOnSuccess: true,
      shouldRetry: (error: any): boolean => {
        return [
          HttpStatus.REQUEST_TIMEOUT,
          HttpStatus.INTERNAL_SERVER_ERROR,
          HttpStatus.BAD_GATEWAY,
          HttpStatus.GATEWAY_TIMEOUT,
          HttpStatus.SERVICE_UNAVAILABLE,
          HttpStatus.TOO_MANY_REQUESTS,
          undefined,
          null,
        ].includes(error?.status);
      },
    });
  }

  public getArchiveMetadata(
    omexMetadataFormat: string,
    file?: Blob,
    url?: string,
  ): Observable<AxiosResponse<BioSimulationsCombineArchiveElementMetadata[]>> {
    return this.service.srcHandlersCombineGetMetadataForCombineArchiveHandlerBiosimulations(
      omexMetadataFormat,
      file,
      url,
    )
    .pipe(this.getRetryBackoff());
  }

  public getManifest(
    file?: Blob,
    url?: string,
  ): Observable<AxiosResponse<CombineArchiveManifest>> {
    return this.service.srcHandlersCombineGetManifestHandler(
        file,
        url
      )
      .pipe(this.getRetryBackoff());
  }

  public getSedMlSpecs(
    file?: Blob,
    url?: string,
  ): Observable<AxiosResponse<CombineArchiveSedDocSpecs>> {
    return this.service.srcHandlersCombineGetSedmlSpecsForCombineArchiveHandler(
      file,
      url,
    )
    .pipe(this.getRetryBackoff());
  }
}

export class MockCombineWrapperService {
  public getArchiveMetadata(
    omexMetadataFormat: string,
    file?: Blob,
    url?: string,
  ) {
    return 'Metadata';
  }
}
