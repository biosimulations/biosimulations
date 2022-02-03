import { ProjectFile } from '@biosimulations/datamodel/api';
import { JobQueue, JobReturn } from '@biosimulations/messages/messages';
import { Processor, Process } from '@ejhayes/nestjs-bullmq';
import { Logger } from '@nestjs/common';

import { Job } from 'bullmq';
import { CombineArchiveManifestContent } from 'dist/libs/combine-api/nest-client/src';
import { firstValueFrom } from 'rxjs';
import { FileService } from '../../file/file.service';

@Processor(JobQueue.files)
export class FilesProcessor {
  private readonly logger = new Logger(FilesProcessor.name);

  public constructor(private fileService: FileService) {}

  @Process({ concurrency: 10 })
  private async process(
    job: Job,
  ): Promise<JobReturn<ProjectFile[] | undefined>> {
    const data = job.data;
    const runId = data.runId;
    const dependencies: Record<string, any> | undefined =
      (await job.getDependencies()).processed || {};

    let manifest: CombineArchiveManifestContent[] | undefined;

    // extract the manifest from the previous job. If this fails, manifest will be undefined
    try {
      manifest = Object.keys(dependencies)
        .filter((key) => key.includes(JobQueue.manifest))
        .map((key) => dependencies[key])[0]?.data;
    } catch (e) {
      this.logger.error(e);
    }

    // if the manifest is undefined, then we can't process the files, return error object
    if (!manifest) {
      return {
        status: 'Failed',
        reason: 'No manifest found',
        data: undefined,
      };
    }

    // try to process the files, catching any errors
    try {
      const files = await firstValueFrom(
        this.fileService.processFiles(runId, manifest),
      );
      return {
        status: 'Succeeded',
        reason: 'Files posted to API Successfully',
        data: files,
      };
    } catch (e) {
      this.logger.error(e);

      // if the job has been attempted less than the max number of attempts, re-throw the error
      if (job.attemptsMade < (job.opts?.attempts || 0)) {
        throw e;
      } else {
        // if the job has been attempted more than the max number of attempts, return an error object
        return {
          status: 'Failed',
          reason: 'Files could not be posted to API',
          data: undefined,
        };
      }
    }
  }
}
