import {
  BioSimulationsCombineArchiveElementMetadata,
  CombineArchiveManifest,
  CombineArchiveSedDocSpecs,
  SimulationProjectsService,
} from '@biosimulations/combine-api-nest-client';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';

@Injectable()
export class CombineWrapperService {
  public constructor(private service: SimulationProjectsService) {}

  public getArchiveMetadata(
    omexMetadataFormat: string,
    file?: Blob,
    url?: string,
  ): Observable<AxiosResponse<BioSimulationsCombineArchiveElementMetadata[]>> {
    return this.service.combineApiHandlersCombineGetMetadataForCombineArchiveHandlerBiosimulations(
      omexMetadataFormat,
      file,
      url,
    );
  }

  public getManifest(file?: Blob, url?: string): Observable<AxiosResponse<CombineArchiveManifest>> {
    return this.service.combineApiHandlersCombineGetManifestHandler(file, url);
  }

  public getSedMlSpecs(file?: Blob, url?: string): Observable<AxiosResponse<CombineArchiveSedDocSpecs>> {
    return this.service.combineApiHandlersCombineGetSedmlSpecsForCombineArchiveHandler(file, url);
  }
}

export class MockCombineWrapperService {
  public getArchiveMetadata(omexMetadataFormat: string, file?: Blob, url?: string) {
    return 'Metadata';
  }
}
