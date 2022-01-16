import { Endpoints } from '@biosimulations/config/common';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CombineWrapperService } from '../combineWrapper.service';
import {
  combineLatest,
  firstValueFrom,
  map,
  mergeMap,
  Observable,
  pluck,
  throwError,
} from 'rxjs';
import { catchError, shareReplay, tap } from 'rxjs/operators';
import { CombineArchiveManifestContent } from '@biosimulations/combine-api-nest-client';
import { ProjectFileInput } from '@biosimulations/datamodel/api';
import { SimulationRunService } from '@biosimulations/api-nest-client';

import {
  SimulationStorageService,
  FileInfo,
} from '@biosimulations/shared/storage';

@Injectable()
export class FileService {
  private logger = new Logger(FileService.name);
  private endpoints: Endpoints;

  public constructor(
    private config: ConfigService,
    private combine: CombineWrapperService,

    private submit: SimulationRunService,
    private storage: SimulationStorageService,
  ) {
    const env = config.get('server.env');
    this.endpoints = new Endpoints(env);
  }

  public getManifestContent(
    id: string,
  ): Observable<CombineArchiveManifestContent[]> {
    // This needs to be true so combine api can access if we are running locally /on kubernetes
    const url = this.endpoints.getRunDownloadEndpoint(true, id);
    this.logger.debug(`Downloading files from ${url}`);
    // get manifest
    const manifestContent = this.combine
      .getManifest(undefined, url)
      .pipe(pluck('data'), pluck('contents'), shareReplay(1));

    return manifestContent;
  }

  public async processFiles(id: string): Promise<void> {
    this.logger.log(`Processing files for simulation run '${id}'.`);
    //get manifest
    const manifestContent = this.getManifestContent(id);
    // save manifest
    await firstValueFrom(
      manifestContent.pipe(
        map((contents: CombineArchiveManifestContent[]) => {
          const apiFiles: Observable<ProjectFileInput>[] = contents
            .filter(
              (file: CombineArchiveManifestContent) =>
                file.location.path != '.',
            )
            .map((file: CombineArchiveManifestContent) => {
              const fileInfo = this.storage
                .getFileInfo(id, file.location.path)
                .pipe(
                  map((fileInfo: FileInfo): ProjectFileInput => {
                    const fileSize = fileInfo.size || 0;
                    const fileObject: ProjectFileInput = {
                      id: id + '/' + file.location.path.replace('./', ''),
                      name: file.location.value.filename,
                      location: file.location.path.replace('./', ''),
                      size: fileSize,
                      format: file.format,
                      master: file.master,
                      url: fileInfo.url,
                    };
                    return fileObject;
                  }),
                  catchError((err) => {
                    this.logger.error(err);
                    this.logger.error(
                      `Could not get file info for ${file.location.path}`,
                    );
                    return throwError(() => err);
                  }),
                );
              return fileInfo;
            });
          // Array of observables to observable of array
          return combineLatest(apiFiles);
        }),

        // collapse observables into one and post to API
        mergeMap((files: Observable<ProjectFileInput[]>) => {
          return files.pipe(
            map((files: ProjectFileInput[]) =>
              this.submit.postFiles(id, files),
            ),
          );
        }),
        mergeMap((files) => files),
        tap((_) => this.logger.log(`Posted files for simulation run '${id}'.`)),
      ),
    );
  }
}
