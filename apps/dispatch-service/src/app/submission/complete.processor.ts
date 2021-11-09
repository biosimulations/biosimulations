import {
  SimulationRunStatus,
  ConsoleFormatting,
} from '@biosimulations/datamodel/common';
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
        name: 'COMBINE archive',
        result: this.fileService.processFiles(id),
        required: true,
        moreInfo: 'https://combinearchive.org',
        validator: 'https://run.biosimulations.org/utils/validate-project',
        plural: false,
      },
      {
        name: 'simulation experiments (SED-ML documents)',
        result: this.sedmlService.processSedml(id),
        required: true,
        moreInfo: 'https://biosimulators.org/conventions/simulation-experiments',
        validator: 'https://run.biosimulations.org/utils/validate-simulation',
        plural: true,
      },
      {
        name: 'simulation results',
        result: this.archiverService.updateResultsSize(id),
        required: true,
        moreInfo: 'https://biosimulators.org/conventions/simulation-reports',
        validator: undefined,
        plural: true,
      },
      {
        name: 'log of the simulation run',
        result: this.logService.createLog(id, false, '', false),
        required: true,
        moreInfo: 'https://biosimulators.org/conventions/simulation-logs',
        validator: 'https://api.biosimulations.org',
        plural: false,
      },
      {
        name: 'metadata for the COMBINE archive',
        result: this.metadataService.createMetadata(id),
        required: false,
        moreInfo: 'https://biosimulators.org/conventions/metadata',
        validator: 'https://run.biosimulations.org/utils/validate-metadata',
        plural: false,
      },
    ];

    const processingResults: PromiseSettledResult<void>[] =
      await Promise.allSettled(
        processingSteps.map((processingStep) => processingStep.result),
      );

    // Keep track of which processing step(s) failed
    const errors: string[] = [];
    const warnings: string[] = [];
    const errorsDetails: string[] = [];
    const warningsDetails: string[] = [];

    for (let iStep = 0; iStep < processingSteps.length; iStep++) {
      const processingStep = processingSteps[iStep];
      const processingResult = processingResults[iStep];

      if (processingResult.status == 'rejected') {
        let reason = '';
        reason += `The ${processingStep.name} could not be saved.`;
        reason += ` Please check that the ${processingStep.name} ${processingStep.plural ? 'are' : 'is'} valid.`;
        reason += `\n    More information is available at ${processingStep.moreInfo}.`;
        if (processingStep.validator) {
          reason += ` A validation tool is\n    available at ${processingStep.validator}.`;
        }

        const details = `The ${processingStep.name} could not be saved: ${processingResult.reason}`;
        if (processingStep.required) {
          errors.push(reason);
          errorsDetails.push(details);
          this.logger.error(details);
        } else {
          warnings.push(reason);
          warningsDetails.push(details);
          this.logger.warn(details);
        }
      }
    }

    const logProcessingResult = processingResults[3];
    const logPostSucceeded = logProcessingResult.status === 'fulfilled';

    /* calculate final status and reason */
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
      updateStatusMessage = `Updated status of simulation run '${id}' to ${status} due to one or more processing errors:\n  * ${errorsDetails.join(
        '\n  * ',
      )}`;
    }

    if (warnings.length) {
      statusReason += '\n\nWarnings:\n  * ' + warnings.join('\n  * ');
      updateStatusMessage += `\n\nThe processing of simulation run '${id}' raised one or more warnings:\n  * ${warningsDetails.join(
        '\n  * ',
      )}`;
    }

    /* append post-processing status reason to log */
    const cyan = ConsoleFormatting.cyan.replace('\\033', '\u001b');
    const red = ConsoleFormatting.red.replace('\\033', '\u001b');
    const yellow = ConsoleFormatting.yellow.replace('\\033', '\u001b');
    const noColor = ConsoleFormatting.noColor.replace('\\033', '\u001b');

    let statusColor!: string;
    let statusEndColor!: string;
    if (errors.length > 0) {
      statusColor = red;
      statusEndColor = noColor;
    } else if (warnings.length > 0) {
      statusColor = yellow;
      statusEndColor = noColor;
    } else {
      statusColor = '';
      statusEndColor = '';
    }

    const extraStdLog =
      '' +
      '\n' +
      `\n${cyan}=========================================== Post-processing simulation run ==========================================${noColor}` +
      `\n${statusColor}${statusReason}${statusEndColor}` +
      '\n' +
      `\n${cyan}================================ Run complete. Thank you for using runBioSimulations! ===============================${noColor}`;
    this.logService
      .createLog(id, true, extraStdLog, logPostSucceeded)
      .catch((run) =>
        this.logger.error(
          `Log for simulation run '${id}' could not be updated`,
        ),
      );

    /* update final status */
    this.simStatusService.updateStatus(id, status, statusReason).then((run) => {
      if (status === SimulationRunStatus.SUCCEEDED) {
        return this.logger.log(updateStatusMessage);
      } else {
        return this.logger.error(updateStatusMessage);
      }
    });

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
                  `Project ${projectId} could not be created with simulation run '${id}'.`,
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
