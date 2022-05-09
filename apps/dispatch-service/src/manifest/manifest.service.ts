import { CombineArchiveManifestContent } from '@biosimulations/combine-api-nest-client';
import { Injectable, Logger } from '@nestjs/common';
import { Observable, pluck, shareReplay } from 'rxjs';
import { CombineWrapperService } from '../combineWrapper.service';
import { FilePaths } from '@biosimulations/shared/storage';

@Injectable()
export class ManifestService {
  private logger: Logger = new Logger(ManifestService.name);
  public constructor(private combine: CombineWrapperService, private filePaths: FilePaths) {}

  public getManifestContent(id: string): Observable<CombineArchiveManifestContent[]> {
    const url = this.filePaths.getSimulationRunFileContentEndpoint(id, 'manifest.xml');

    // print status message
    this.logger.debug(`Getting manifest from ${url}`);

    // get manifest
    const manifestContent = this.combine
      .getManifest(undefined, url)
      .pipe(pluck('data'), pluck('contents'), shareReplay(1));

    return manifestContent;
  }
}
