import { ProjectService } from '@biosimulations/api-nest-client';
import { ProjectInput, SimulationRunStatus } from '@biosimulations/datamodel/common';
import { JobQueue, PublishJobData } from '@biosimulations/messages/messages';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { HttpStatus, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { retryBackoff } from '@biosimulations/rxjs-backoff';
import { Job } from 'bullmq';
import { catchError, firstValueFrom, map, Observable } from 'rxjs';

type stepsInfo = {
  name: string;
  status: string;
  returnValue: any;
  required: boolean;
  reason: string;
  data: any;
  children: string[];
};
@Processor(JobQueue.publish, { concurrency: 10 })
export class PublishProcessor extends WorkerHost {
  private readonly logger = new Logger(PublishProcessor.name);
  public constructor(private readonly projectService: ProjectService) {
    super();
  }

  public async process(job: Job<PublishJobData, void, 'complete'>) {
    const data = job.data;
    const projectId = data.projectId;
    const projectOwner = data.projectOwner;
    const runId = data.runId;
    const finalStatus = data.finalStatus;

    if (projectId && projectOwner && finalStatus === SimulationRunStatus.SUCCEEDED) {
      await this.publishProject(projectId, runId, projectOwner);
    }
  }
  private getErrorMessage(error: any): string {
    let message: string;
    this.logger.error(`Error: ${error}`);
    if (error?.isAxiosError) {
      message = `${error?.response?.status}: ${error?.response?.data?.detail || error?.response?.statusText}`;
    } else {
      message = `${error?.status || error?.statusCode}: ${error?.message}`;
    }

    return message.replace(/\n/g, '\n  ');
  }

  private async publishProject(projectId: string, runId: string, projectOwner: string): Promise<void> {
    const projectInput: ProjectInput = {
      id: projectId,
      simulationRun: runId,
      owner: projectOwner,
    };

    const updatedProject$ = this.projectService.getProject(projectId).pipe(
      this.getRetryBackoff(),
      map((_project) => {
        this.projectService.updateProject(projectId, projectInput).pipe(this.getRetryBackoff());
      }),
      catchError((error) => {
        if (error.response?.status === HttpStatus.NOT_FOUND) {
          return this.projectService.createProject(projectInput).pipe(this.getRetryBackoff());
        }
        throw error;
      }),
    );
    await firstValueFrom(updatedProject$)
      .then(() => this.logger.log(`The project '${projectId}' was successfully published.`))
      .catch((error) =>
        this.logger.error(`The project '${projectId}' could not be published: ${this.getErrorMessage(error)}`),
      );
  }

  private getRetryBackoff(): <T>(source: Observable<T>) => Observable<T> {
    return retryBackoff({
      initialInterval: 100,
      maxRetries: 10,
      resetOnSuccess: true,
      shouldRetry: (error: AxiosError): boolean => {
        const retryCodes = [
          HttpStatus.REQUEST_TIMEOUT,
          HttpStatus.INTERNAL_SERVER_ERROR,
          HttpStatus.BAD_GATEWAY,
          HttpStatus.GATEWAY_TIMEOUT,
          HttpStatus.SERVICE_UNAVAILABLE,
          HttpStatus.TOO_MANY_REQUESTS,
          undefined,
          null,
        ];
        return retryCodes.includes(error?.response?.status);
      },
    });
  }
}
