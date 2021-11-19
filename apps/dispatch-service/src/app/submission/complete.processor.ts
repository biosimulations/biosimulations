import {
  SimulationRunStatus,
  ConsoleFormatting,
  CombineArchiveLog,
  SedOutputElementLog,
  SimulationRunLogStatus,
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

interface ProcessingResult {
  succeeded: boolean;
  value?: any;
}

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

    const runId: string = data.runId;
    const runStatus: SimulationRunStatus = data.status;
    const runStatusReason: string = data.statusReason;
    const projectId = data.projectId;
    const projectOwner = data.projectOwner;

    this.logger.debug(
      `Simulation run '${runId}' finished. Saving files, specifications, results, logs, metadata ...`,
    );

    const processingSteps = [
      {
        name: 'COMBINE archive',
        result: this.fileService.processFiles(runId),
        required: true,
        moreInfo: 'https://combinearchive.org',
        validator: 'https://run.biosimulations.org/utils/validate-project',
        plural: false,
      },
      {
        name: 'simulation experiments (SED-ML documents)',
        result: this.sedmlService.processSedml(runId),
        required: true,
        moreInfo:
          'https://biosimulators.org/conventions/simulation-experiments',
        validator: 'https://run.biosimulations.org/utils/validate-simulation',
        plural: true,
      },
      {
        name: 'simulation results',
        result: this.archiverService.updateResultsSize(runId),
        required: true,
        moreInfo: 'https://biosimulators.org/conventions/simulation-reports',
        validator: undefined,
        plural: true,
      },
      {
        name: 'log of the simulation run',
        result: this.logService.createLog(runId, false, '', false),
        required: true,
        moreInfo: 'https://biosimulators.org/conventions/simulation-logs',
        validator: 'https://api.biosimulations.org',
        plural: false,
      },
      {
        name: 'metadata for the COMBINE archive',
        result: this.metadataService.createMetadata(runId),
        required: false,
        moreInfo: 'https://biosimulators.org/conventions/metadata',
        validator: 'https://run.biosimulations.org/utils/validate-metadata',
        plural: false,
      },
    ];

    // Keep track of which processing step(s) failed
    const errors: string[] = [];
    const warnings: string[] = [];
    const errorsDetails: string[] = [];
    const warningsDetails: string[] = [];

    const processingResults: ProcessingResult[] = await Promise.all(
      processingSteps.map((processingStep) =>
        processingStep.result
          .then((value) => {
            return {
              succeeded: true,
              value: value,
            };
          })
          .catch((error) => {
            let reason = '';
            reason += `The ${processingStep.name} could not be saved.`;
            reason += ` Please check that the ${processingStep.name} ${
              processingStep.plural ? 'are' : 'is'
            } valid.`;
            reason += `\n    More information is available at ${processingStep.moreInfo}.`;
            if (processingStep.validator) {
              reason += ` A validation tool is\n    available at ${processingStep.validator}.`;
            }

            const details = `The ${processingStep.name} for simulation run '${runId}' could not be saved: ${error.status}: ${error.message}`;
            if (processingStep.required) {
              errors.push(reason);
              errorsDetails.push(details);
              this.logger.error(details);
            } else {
              warnings.push(reason);
              warningsDetails.push(details);
              this.logger.warn(details);
            }

            return {
              succeeded: false,
            };
          }),
      ),
    );

    const log = processingResults[3]?.value;
    const logPostSucceeded = processingResults[3].succeeded;
    const runSuceededFromLog = this.getRunSuceededFromLog(log);

    /* calculate final status and reason */
    let postProcessingStatus!: SimulationRunStatus;
    let postProcessingStatusReason!: string;
    let updateStatusMessage!: string;
    if (errors.length === 0) {
      postProcessingStatus = SimulationRunStatus.SUCCEEDED;
      postProcessingStatusReason =
        'The simulation run was successfully proccessed.';
      updateStatusMessage = `Post-processing of simulation run '${runId}' completed with status '${postProcessingStatus}'.`;
    } else {
      postProcessingStatus = SimulationRunStatus.FAILED;
      postProcessingStatusReason =
        'The simulation run was not successfully proccessed.';
      postProcessingStatusReason += '\n\nErrors:\n  * ' + errors.join('\n  * ');
      updateStatusMessage = `Post-processing of simulation run '${runId}' completed with status '${postProcessingStatus}' due to ${
        errorsDetails.length
      } processing errors:\n  * ${errorsDetails.join('\n  * ')}`;
    }

    if (warnings.length) {
      postProcessingStatusReason +=
        '\n\nWarnings:\n  * ' + warnings.join('\n  * ');
      updateStatusMessage += `\n\nThe post-processing of simulation run '${runId}' raised one or more warnings:\n  * ${warningsDetails.join(
        '\n  * ',
      )}`;
    }

    /* append post-processing status reason to log */
    const cyan = ConsoleFormatting.cyan.replace('\\033', '\u001b');
    const red = ConsoleFormatting.red.replace('\\033', '\u001b');
    const yellow = ConsoleFormatting.yellow.replace('\\033', '\u001b');
    const noColor = ConsoleFormatting.noColor.replace('\\033', '\u001b');

    let postProcessingStatusColor!: string;
    let postProcessingStatusEndColor!: string;
    if (errors.length > 0) {
      postProcessingStatusColor = red;
      postProcessingStatusEndColor = noColor;
    } else if (warnings.length > 0) {
      postProcessingStatusColor = yellow;
      postProcessingStatusEndColor = noColor;
    } else {
      postProcessingStatusColor = '';
      postProcessingStatusEndColor = '';
    }

    const extraStdLog =
      '' +
      '\n' +
      `\n${cyan}=========================================== Post-processing simulation run ==========================================${noColor}` +
      `\n${postProcessingStatusColor}${postProcessingStatusReason}${postProcessingStatusEndColor}` +
      '\n' +
      `\n${cyan}================================ Run complete. Thank you for using runBioSimulations! ===============================${noColor}`;
    this.logService
      .createLog(runId, true, extraStdLog, logPostSucceeded)
      .catch((run) =>
        this.logger.error(
          `Log for simulation run '${runId}' could not be updated.`,
        ),
      );

    /* update final status */
    let finalStatus: SimulationRunStatus;
    const finalStatusReason =
      runStatusReason + '\n\n' + postProcessingStatusReason;
    if (
      runStatus === SimulationRunStatus.SUCCEEDED &&
      runSuceededFromLog &&
      postProcessingStatus === SimulationRunStatus.SUCCEEDED
    ) {
      finalStatus = SimulationRunStatus.SUCCEEDED;
    } else {
      finalStatus = SimulationRunStatus.FAILED;
    }

    this.simStatusService
      .updateStatus(runId, finalStatus, finalStatusReason)
      .then((run) => {
        if (postProcessingStatus === SimulationRunStatus.SUCCEEDED) {
          return this.logger.log(updateStatusMessage);
        } else {
          return this.logger.error(updateStatusMessage);
        }
      });

    /* publish run as project */
    if (projectId && finalStatus === SimulationRunStatus.SUCCEEDED) {
      const projectInput: ProjectInput = {
        id: projectId,
        simulationRun: runId,
        owner: projectOwner,
      };

      return this.projectService
        .getProject(projectId)
        .toPromise()
        .then((project) => {
          this.projectService
            .updateProject(projectId, projectInput)
            .toPromise()
            .then(() =>
              this.logger.log(
                `Updated project '${projectId}' for simulation '${runId}'.`,
              ),
            )
            .catch((err) =>
              this.logger.log(
                `Project '${projectId}' could not be updated with simulation '${runId}'.`,
              ),
            );
        })
        .catch((err: AxiosError) => {
          if (err?.response?.status === HttpStatus.NOT_FOUND) {
            this.projectService
              .createProject(projectInput)
              .toPromise()
              .then(() =>
                this.logger.log(
                  `Created project '${projectId}' for simulation '${runId}'.`,
                ),
              )
              .catch((err) =>
                this.logger.log(
                  `Project '${projectId}' could not be created with simulation run '${runId}'.`,
                ),
              );
          } else {
            this.logger.error('Failed to update status');
            this.logger.error(err);
          }
        });
    }
  }

  private getRunSuceededFromLog(log?: CombineArchiveLog): boolean {
    if (log === undefined) {
      return false;
    }

    if (log.status !== SimulationRunLogStatus.SUCCEEDED) {
      return false;
    }

    for (const sedDocLog of log.sedDocuments || []) {
      if (sedDocLog.status !== SimulationRunLogStatus.SUCCEEDED) {
        return false;
      }
      for (const taskLog of sedDocLog.tasks || []) {
        if (taskLog.status !== SimulationRunLogStatus.SUCCEEDED) {
          return false;
        }
      }
      for (const outputLog of sedDocLog.outputs || []) {
        if (outputLog.status !== SimulationRunLogStatus.SUCCEEDED) {
          return false;
        }

        let outputElementsLogs: SedOutputElementLog[] | null = null;
        if ('dataSets' in outputLog) {
          outputElementsLogs = outputLog.dataSets;
        } else if ('curves' in outputLog) {
          outputElementsLogs = outputLog.curves;
        } else if ('surfaces' in outputLog) {
          outputElementsLogs = outputLog.surfaces;
        }

        for (const outputElementsLog of outputElementsLogs || []) {
          if (outputElementsLog.status !== SimulationRunLogStatus.SUCCEEDED) {
            return false;
          }
        }
      }
    }

    return true;
  }
}
