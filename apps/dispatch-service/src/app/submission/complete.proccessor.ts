import { SimulationRunStatus } from '@biosimulations/datamodel/common';
// import { ProjectInput } from '@biosimulations/datamodel/api';
import { CompleteJob, JobQueue } from '@biosimulations/messages/messages';

import { Processor, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { ArchiverService } from '../results/archiver.service';
import { LogService } from '../results/log.service';
import { MetadataService } from '../../metadata/metadata.service';

import { SimulationStatusService } from '../services/simulationStatus.service';
import { FileService } from '../../file/file.service';
import { SedmlService } from '../../sedml/sedml.service';
// import { ProjectService } from '@biosimulations/backend-api-client';
// import { AxiosError } from '@nestjs/axios';

@Processor(JobQueue.complete)
export class CompleteProccessor {
  private readonly logger = new Logger(CompleteProccessor.name);
  public constructor(
    private archiverService: ArchiverService,
    private simStatusService: SimulationStatusService,
    private logService: LogService,
    private metadataService: MetadataService,
    private fileService: FileService,
    private sedmlService: SedmlService,
    // private projectService: ProjectService,
  ) {}

  @Process()
  private async handleProcessing(job: Job<CompleteJob>): Promise<void> {
    const data = job.data;

    const id = data.simId;
    const isPublic = data.isPublic;

    this.logger.debug(`Simulation ${id} finished. Saving files, specifications, results, logs, metadata ...`);

    const processingSteps = [
      {
        name: 'The files of the COMBINE archive',
        result: this.fileService.processFiles(id),
        required: true,
      },
      {
        name: 'The specifications of the simulation (SED-ML documents)',
        result: this.sedmlService.processSedml(id),
        required: true,
      },
      {
        name: 'The size of the simulation results',
        result: this.archiverService.updateResultsSize(id),
        required: true,
      },
      {
        name: 'The log of the simulation',
        result: this.logService.createLog(id),
        required: true,
      },
      {
        name: 'The metadata for the COMBINE archive',
        result: this.metadataService.createMetadata(id, isPublic),
        required: false,
      },
    ];

    const processingResults: PromiseSettledResult<void>[] =
      await Promise.allSettled(processingSteps.map((processingStep) => processingStep.result));

    // Keep track of which processing step(s) failed
    const errors: string[] = [];
    const warnings: string[] = [];

    for (let iStep = 0; iStep < processingSteps.length; iStep++) {
      const processingStep = processingSteps[iStep];
      const processingResult = processingResults[iStep];

      if (processingResult.status == 'rejected') {
        const reason = `${processingStep.name} could not be saved: ${processingResult.reason}`;
        if (processingStep.required) {
          errors.push(reason);
          this.logger.error(reason);
        } else {
          warnings.push(reason)
          this.logger.warn(reason);
        }
      }
    }

    if (errors.length === 0) {
      let msg = 'The simulation run was successfully proccessed.';
      if (warnings) {
        msg += '\n\nWarnings:\n  * ' + warnings.join('\n  * ');
      }

      this.simStatusService
        .updateStatus(id, SimulationRunStatus.SUCCEEDED, msg)
        .then((run) => this.logger.log(`Updated status of simulation ${id} to SUCCEEDED`));

      /*
      if (isPublic) {
        const projectInput: ProjectInput = {
          id: projectId,
          simulationRun: id,
        };

        return this.projectService
          .getProject(projectId)
          .toPromise()
          .then((project) => {
            this.projectService
              .updateProject(projectId, projectInput)
              .then((project) => this.logger.log(`Updated project ${projectId} for simulation ${id}`))
              .catch((err) => this.logger.log(`Project ${projectId} could not be updated with simulation ${id}`));
          })
          .catch((err: AxiosError) => {
            if (e.response.status === 404) {
              this.projectService
                .createProject(projectInput)
                .then((project) => this.logger.log(`Created project ${projectId} for simulation ${id}`))
                .catch((err) => this.logger.log(`Project ${projectId} could not be created with simulation ${id}`));
            } else {
              this.logger.error('Failed to update status');
              this.logger.error(err);
            }
          });
      }
      */
    } else {
      let msg = 'The simulation run was not successfully proccessed.';
      msg += '\n\nErrors:\n  * ' + errors.join('\n  * ');
      if (warnings) {
        msg += '\n\nWarnings:\n  * ' + warnings.join('\n  * ');
      }

      this.simStatusService
        .updateStatus(id, SimulationRunStatus.FAILED, msg)
        .then((run) => this.logger.error(`Updated status of simulation ${id} to FAILED due to one or more processing errors:\n  * ${errors.join('\n  * ')}`));
    }
  }
}
