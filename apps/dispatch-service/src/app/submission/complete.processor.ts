import { SimulationRunStatus, ConsoleFormatting } from '@biosimulations/datamodel/common';
import { ProjectInput } from '@biosimulations/datamodel/api';
import { CompleteJob, JobQueue } from '@biosimulations/messages/messages';

import { Processor, Process } from '@nestjs/bull';
import { Logger, HttpStatus } from '@nestjs/common';
import { Job } from 'bull';
import { ArchiverService } from '../results/archiver.service';
import { LogService } from '../results/log.service';
import { MetadataService } from '../../metadata/metadata.service';

import { SimulationStatusService } from '../services/simulationStatus.service';
import { FileService } from '../../file/file.service';
import { SedmlService } from '../../sedml/sedml.service';
import { ProjectService } from '@biosimulations/api-nest-client';
import { AxiosError } from 'axios';

@Processor(JobQueue.complete)
export class CompleteProcessor {
  private readonly logger = new Logger(CompleteProcessor.name);
  public constructor(
    private archiverService: ArchiverService,
    private simStatusService: SimulationStatusService,
    private logService: LogService,
    private metadataService: MetadataService,
    private fileService: FileService,
    private sedmlService: SedmlService,
    private projectService: ProjectService,
  ) {}

  @Process()
  private async handleProcessing(job: Job<CompleteJob>): Promise<void> {
    const data = job.data;

    const id = data.simId;
    const projectId = data.projectId;
    const projectOwner = data.projectOwner;

    this.logger.debug(
      `Simulation ${id} finished. Saving files, specifications, results, logs, metadata ...`,
    );

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
        result: this.metadataService.createMetadata(id),
        required: false,
      },
    ];

    const processingResults: PromiseSettledResult<void>[] =
      await Promise.allSettled(
        processingSteps.map((processingStep) => processingStep.result),
      );

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
          warnings.push(reason);
          this.logger.warn(reason);
        }
      }
    }

    const logProcessingResult = processingResults[3];
    const logPostSucceeded = logProcessingResult.status === 'fulfilled' && logProcessingResult?.value;

    /* update status with post-processing result */
    let status!: SimulationRunStatus;
    let statusReason!: string;
    let updateStatusMessage!: string;
    if (errors.length === 0) {
      status = SimulationRunStatus.SUCCEEDED;
      statusReason = 'The simulation run was successfully proccessed.';
      updateStatusMessage = `Updated status of simulation ${id} to ${status}`;      
    } else {
      status = SimulationRunStatus.FAILED;
      statusReason = 'The simulation run was not successfully proccessed.';
      statusReason += '\n\nErrors:\n  * ' + errors.join('\n  * ');
      updateStatusMessage = `Updated status of simulation run '${id}' to ${status} due to one or more processing errors:\n  * ${errors.join(
        '\n  * ',
      )}`;
    }

    if (warnings.length) {
      statusReason += '\n\nWarnings:\n  * ' + warnings.join('\n  * ');
    }

    this.simStatusService
      .updateStatus(id, status, statusReason)
      .then((run) => {
        if (status === SimulationRunStatus.SUCCEEDED) {
          return this.logger.log(updateStatusMessage);
        } else {
          return this.logger.error(updateStatusMessage);
        }
      });

    /* append post-processing information to log */
    let statusColor!: string;
    let statusEndColor!: string;
    if (errors.length > 0) {
      statusColor = ConsoleFormatting.red;
      statusEndColor = ConsoleFormatting.noColor;
    } else if (warnings.length > 0) {
      statusColor = ConsoleFormatting.yellow;
      statusEndColor = ConsoleFormatting.noColor;
    } else {
      statusColor = '';
      statusEndColor = '';
    }

    const extraStdLog = (
      ''
      + '\n'
      + `\n${ConsoleFormatting.cyan}======================= Post-processing simulation run ======================${ConsoleFormatting.noColor}`
      + `\n${statusColor}statusReason${statusEndColor}`
      + '\n'
      + `\n${ConsoleFormatting.cyan}============ Run complete. Thank you for using runBioSimulations! ===========${ConsoleFormatting.noColor}`
    );
    this.logService.createLog(id, !logPostSucceeded, extraStdLog, true)
      .then((run) =>
        this.logger.error(
          `Log for simulation run '${id}' could not be updated`,
        ),
      );

    /* publish run as project */
    if (projectId && errors.length === 0) {
      const projectInput: ProjectInput = {
        id: projectId,
        simulationRun: id,
        owner: projectOwner,
      };

      return this.projectService
        .getProject(projectId)
        .toPromise()
        .then((project) => {
          this.projectService
            .updateProject(projectId, projectInput)
            .toPromise()
            .then((project) =>
              this.logger.log(
                `Updated project ${projectId} for simulation ${id}`,
              ),
            )
            .catch((err) =>
              this.logger.log(
                `Project ${projectId} could not be updated with simulation ${id}`,
              ),
            );
        })
        .catch((err: AxiosError) => {
          if (err?.response?.status === HttpStatus.NOT_FOUND) {
            this.projectService
              .createProject(projectInput)
              .toPromise()
              .then((project) =>
                this.logger.log(
                  `Created project ${projectId} for simulation ${id}`,
                ),
              )
              .catch((err) =>
                this.logger.log(
                  `Project ${projectId} could not be created with simulation ${id}`,
                ),
              );
          } else {
            this.logger.error('Failed to update status');
            this.logger.error(err);
          }
        });
    }
  }
}
