import { COMBINEService } from '@biosimulations/combine-api-client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CombineWrapperService {
  public constructor(private service: COMBINEService) {}

  public getArchiveMetadata(file?: Blob, url?: string) {
    return this.service.srcHandlersCombineGetMetadataForCombineArchiveHandlerBiosimulations(
      file,
      url,
    );
  }
}

export class MockCombineWrapperService {
  public getArchiveMetadata(file?: Blob, url?: string) {
    return 'Metadata';
  }
}
