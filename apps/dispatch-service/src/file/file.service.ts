import { Endpoints } from '@biosimulations/config/common';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { combineLatest, map, Observable, of, throwError } from 'rxjs';
import { catchError, mergeAll } from 'rxjs/operators';
import { CombineArchiveManifestContent } from '@biosimulations/combine-api-nest-client';
import { ProjectFile, ProjectFileInput } from '@biosimulations/datamodel/api';
import { SimulationRunService } from '@biosimulations/api-nest-client';

import { SimulationStorageService, FileInfo } from '@biosimulations/shared/storage';

@Injectable()
export class FileService {
  private logger = new Logger(FileService.name);
  private endpoints: Endpoints;

  public constructor(
    private config: ConfigService,
    private submit: SimulationRunService,
    private storage: SimulationStorageService,
  ) {
    const env = config.get('server.env');
    this.endpoints = new Endpoints(env);
  }

  public processFiles(id: string, manifestContent: CombineArchiveManifestContent[]): Observable<ProjectFile[]> {
    const files = this.getFiles(id, manifestContent).pipe(
      map((files: ProjectFileInput[]) => {
        return this.postFiles(id, files);
      }),
      mergeAll(),
    );

    return files;
  }

  public getFiles(id: string, manifestContent: CombineArchiveManifestContent[]): Observable<ProjectFileInput[]> {
    this.logger.log(`Processing files for simulation run '${id}' ...`);
    const manifestApiContent: Observable<ProjectFileInput[]> = of(manifestContent).pipe(
      map((contents: CombineArchiveManifestContent[]) => {
        const apiFiles: Observable<ProjectFileInput>[] = contents
          .filter((file: CombineArchiveManifestContent) => file.location.path != '.')
          .map((file: CombineArchiveManifestContent) => {
            const fileInfo = this.storage.getSimulationRunContentFileInfo(id, file.location.path).pipe(
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
                this.logger.error(`Could not get file info for ${file.location.path}`);
                return throwError(() => err);
              }),
            );
            return fileInfo;
          });
        // Array of observables to observable of array
        return combineLatest(apiFiles);
      }),
      mergeAll(),
    );

    return manifestApiContent;
  }

  public postFiles(id: string, manifestContent: ProjectFileInput[]): Observable<ProjectFile[]> {
    const postResults = this.submit.postFiles(id, manifestContent);

    return postResults;
  }
}
