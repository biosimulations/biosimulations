import { Endpoints } from '@biosimulations/config/common';
import { FilePaths } from '@biosimulations/shared/storage';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

import { CombineWrapperService } from '../combineWrapper.service';
import {
  combineLatest,
  firstValueFrom,
  map,
  mergeMap,
  Observable,
  pluck,
} from 'rxjs';
import { CombineArchiveManifestContent } from '@biosimulations/combine-api-nest-client';
import { ProjectFileInput } from '@biosimulations/datamodel/api';
import { SimulationRunService } from '@biosimulations/api-nest-client';

@Injectable()
export class FileService {
  private logger = new Logger(FileService.name);
  private endpoints: Endpoints;
  private filePaths: FilePaths;

  public constructor(
    private config: ConfigService,
    private combine: CombineWrapperService,
    private httpService: HttpService,
    private submit: SimulationRunService,
  ) {
    const env = config.get('server.env');
    this.endpoints = new Endpoints(env);
    this.filePaths = new FilePaths(env);
  }

  public async processFiles(id: string): Promise<void> {
    this.logger.log(`Processing files for simulation run '${id}'.`);
    const url = this.endpoints.getRunDownloadEndpoint(false, id);

    await firstValueFrom(
      this.combine.getManifest(undefined, url).pipe(
        pluck('data'),
        pluck('contents'),
        map((combineFiles: CombineArchiveManifestContent[]) => {
          const apiFiles: Observable<ProjectFileInput>[] = combineFiles
            .filter(
              (file: CombineArchiveManifestContent) =>
                file.location.path != '.',
            )
            .map((file: CombineArchiveManifestContent) => {
              const fileUrl =
                this.filePaths.getSimulationRunFileContentEndpoint(
                  false,
                  id,
                  file.location.path,
                );
              // This is a silly way to get the file size, but it works for now
              const apiFile = this.httpService.head(fileUrl).pipe(
                pluck('headers'),
                pluck('content-length'),
                map((size: string): ProjectFileInput => {
                  const fileSize = parseInt(size) || 0;
                  const fileObject: ProjectFileInput = {
                    id: id + '/' + file.location.path.replace('./', ''),
                    name: file.location.value.filename,
                    location: file.location.path.replace('./', ''),
                    size: fileSize,
                    format: file.format,
                    master: file.master,
                    url: fileUrl,
                  };
                  return fileObject;
                }),
              );
              return apiFile;
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
      ),
    );

    return;
  }
}
