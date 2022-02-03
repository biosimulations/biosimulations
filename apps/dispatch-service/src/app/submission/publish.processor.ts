import { ProjectService } from '@biosimulations/api-nest-client';
import {
  ProjectInput,
  SimulationRunStatus,
} from '@biosimulations/datamodel/common';
import { JobQueue, PublishJobData } from '@biosimulations/messages/messages';
import { Processor, Process } from '@ejhayes/nestjs-bullmq';
import { HttpStatus, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { retryBackoff } from 'backoff-rxjs';
import { Job } from 'bullmq';
import { Observable } from 'rxjs';

type stepsInfo = {
  name: string;
  status: string;
  returnValue: any;
  required: boolean;
  reason: string;
  data: any;
  children: string[];
};
@Processor(JobQueue.complete)
export class PublishProcessor {
  private readonly logger = new Logger(PublishProcessor.name);
  public constructor(private readonly projectService: ProjectService) {}

  @Process()
  public async processPublish(job: Job<PublishJobData, void, 'complete'>) {
    const data = job.data;
    const projectId = data.projectId;
    const projectOwner = data.projectOwner;
    const runId = data.runId;
    const finalStatus = data.finalStatus;

    if (
      projectId &&
      projectOwner &&
      finalStatus === SimulationRunStatus.SUCCEEDED
    ) {
      await this.publishProject(projectId, runId, projectOwner);
    }
  }
  private getErrorMessage(error: any): string {
    let message: string;
    this.logger.error(`Error: ${error}`);
    if (error?.isAxiosError) {
      message = `${error?.response?.status}: ${
        error?.response?.data?.detail || error?.response?.statusText
      }`;
    } else {
      message = `${error?.status || error?.statusCode}: ${error?.message}`;
    }

    return message.replace(/\n/g, '\n  ');
  }

  private async publishProject(
    projectId: string,
    runId: string,
    projectOwner: string,
  ): Promise<void> {
    const projectInput: ProjectInput = {
      id: projectId,
      simulationRun: runId,
      owner: projectOwner,
    };

    await this.projectService
      .getProject(projectId)
      .pipe(this.getRetryBackoff())
      .toPromise()
      .then((project) => {
        this.projectService
          .updateProject(projectId, projectInput)
          .pipe(this.getRetryBackoff())
          .toPromise()
          .then(() =>
            this.logger.log(
              `Updated project '${projectId}' for simulation '${runId}'.`,
            ),
          )
          .catch((error: any) =>
            this.logger.error(
              `Project '${projectId}' could not be updated with simulation '${runId}': ${this.getErrorMessage(
                error,
              )}.`,
            ),
          );
      })
      .catch((error: AxiosError) => {
        if (error?.response?.status === HttpStatus.NOT_FOUND) {
          this.projectService
            .createProject(projectInput)
            .pipe(this.getRetryBackoff())
            .toPromise()
            .then(() =>
              this.logger.log(
                `Created project '${projectId}' for simulation '${runId}'.`,
              ),
            )
            .catch((innerError: AxiosError) =>
              this.logger.error(
                `Project '${projectId}' could not be created with simulation run '${runId}': ${this.getErrorMessage(
                  innerError,
                )}.`,
              ),
            );
        } else {
          this.logger.error(
            `Failed to update status: ${this.getErrorMessage(error)}.`,
          );
        }
      });
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
