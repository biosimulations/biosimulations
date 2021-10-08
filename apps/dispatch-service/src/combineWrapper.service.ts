import {
  BioSimulationsCombineArchiveElementMetadata,
  CombineArchiveManifest,
  CombineArchiveSedDocSpecs,
  SimulationProjectsCOMBINEOMEXArchivesService,
} from '@biosimulations/combine-api-client';
import { OmexMetadataInputFormat } from '@biosimulations/datamodel/common';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';

@Injectable()
export class CombineWrapperService {
  public constructor(private service: SimulationProjectsCOMBINEOMEXArchivesService) {}

  public getArchiveMetadata(
    omexMetadataFormat: string,
    file?: Blob,
    url?: string,
  ): Observable<AxiosResponse<BioSimulationsCombineArchiveElementMetadata[]>> {
    return this.service.srcHandlersCombineGetMetadataForCombineArchiveHandlerBiosimulations(
      omexMetadataFormat,
      file,
      url,
    );
  }

  public getManifest(
    file?: Blob,
    url?: string,
  ): Observable<AxiosResponse<CombineArchiveManifest>> {
    return this.service.srcHandlersCombineGetManifestHandler(file, url);
  }

  public getSedMlSpecs(
    file?: Blob,
    url?: string,
  ): Observable<AxiosResponse<CombineArchiveSedDocSpecs>> {
    return this.service.srcHandlersCombineGetSedmlSpecsForCombineArchiveHandler(
      file,
      url,
    );
  }
}

export class MockCombineWrapperService {
  public getArchiveMetadata(omexMetadataFormat: OmexMetadataInputFormat, file?: Blob, url?: string) {
    return 'Metadata';
  }
}
