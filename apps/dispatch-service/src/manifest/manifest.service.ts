import { CombineArchiveManifestContent } from '@biosimulations/combine-api-nest-client';
import { Endpoints } from '@biosimulations/config/common';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable, pluck, shareReplay } from 'rxjs';
import { CombineWrapperService } from '../combineWrapper.service';

@Injectable()
export class ManifestService {
  private logger: Logger = new Logger(ManifestService.name);
  private endpoints: Endpoints;
  public constructor(
    private config: ConfigService,
    private combine: CombineWrapperService,
  ) {
    const env = config.get('server.env');
    this.endpoints = new Endpoints(env);
  }
  public getManifestContent(
    id: string,
  ): Observable<CombineArchiveManifestContent[]> {
    // This needs to be true so combine api can access if we are running locally /on kubernetes
    const url = this.endpoints.getRunDownloadEndpoint(true, id);
    this.logger.debug(`Getting manifest from ${url}`);
    // get manifest
    const manifestContent = this.combine
      .getManifest(undefined, url)
      .pipe(pluck('data'), pluck('contents'), shareReplay(1));

    return manifestContent;
  }
}
