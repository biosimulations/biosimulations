/**
 * @file Provides methods to implement validation logic for simulation run
 * @copyright BioSimulations Team, 2020
 * @license MIT
 */

import { Injectable, Logger, HttpStatus } from '@nestjs/common';

import { SimulationRunModelReturnType } from './simulation-run.model';

import {
  SimulationRunStatus,
  SimulationRunLogStatus,
  CombineArchiveLog,
} from '@biosimulations/datamodel/common';
import { BIOSIMULATIONS_FORMATS } from '@biosimulations/ontology/extra-sources';

import { BiosimulationsException } from '@biosimulations/shared/exceptions';

import { FilesService } from '../files/files.service';
import { SpecificationsService } from '../specifications/specifications.service';
import { ResultsService } from '../results/results.service';
import { LogsService } from '../logs/logs.service';
import { MetadataService } from '../metadata/metadata.service';

import { FileModel } from '../files/files.model';
import {
  SpecificationsModel,
  SedReport,
  SedPlot2D,
  SedPlot3D,
  SedDataSet,
  SedCurve,
  SedSurface,
} from '../specifications/specifications.model';
import { SimulationRunService } from './simulation-run.service';

import { ModuleRef } from '@nestjs/core';

import { AxiosError } from 'axios';
import {
  SimulationRunMetadataIdModel,
  MetadataModel,
} from '../metadata/metadata.model';
import { Output, OutputData, Results } from '../results/datamodel';

// 1 GB in bytes to be used as file size limits

type CheckResult =
  | FileModel[]
  | SpecificationsModel[]
  | Results
  | CombineArchiveLog
  | SimulationRunMetadataIdModel
  | null;

interface Check {
  check: Promise<CheckResult>;
  errorMessage: string;
  isValid: (result: any) => boolean;
}

interface PromiseResult<T> {
  id?: string;
  succeeded: boolean;
  value?: T;
  error?: AxiosError;
}

@Injectable()
export class SimulationRunValidationService {
  private vegaFormatOmexManifestUris: string[];

  private logger = new Logger(SimulationRunValidationService.name);
  private simulationRunService!: SimulationRunService;

  public constructor(
    private filesService: FilesService,
    private specificationsService: SpecificationsService,
    private resultsService: ResultsService,
    private logsService: LogsService,
    private metadataService: MetadataService,
    private moduleRef: ModuleRef,
  ) {
    const vegaFormatOmexManifestUris = BIOSIMULATIONS_FORMATS.filter(
      (format) => format.id === 'format_3969',
    )?.[0]?.biosimulationsMetadata?.omexManifestUris;
    if (vegaFormatOmexManifestUris) {
      this.vegaFormatOmexManifestUris = vegaFormatOmexManifestUris;
    } else {
      throw new Error(
        'Vega format (EDAM:format_3969) must be annotated with one or more OMEX Manifest URIs',
      );
    }
  }

  public onModuleInit(): void {
    this.simulationRunService = this.moduleRef.get(SimulationRunService, {
      strict: false,
    });
  }

  /** Check that a simulation run is valid
   *
   * * Run: was successful (`SUCCEEDED` state)
   * * Files: valid and accessible
   * * Simulation specifications: valid and accessible
   * * Results: valid and accessible
   * * Logs: valid and accessible
   * * Metatadata: valid and meets minimum requirements
   *
   * @param id id of the simulation run
   * @param validateSimulationResultsData whether to validate the data for each SED-ML report and plot of each SED-ML document
   */
  public async validateRun(
    id: string,
    validateSimulationResultsData = false,
  ): Promise<void> {
    let run!: SimulationRunModelReturnType | null;
    try {
      run = await this.simulationRunService.get(id);
    } catch {
      throw new BiosimulationsException(
        HttpStatus.BAD_REQUEST,
        'Simulation run is not valid for publication.',
        `'${id}' is not a valid id for a simulation run. Only successful simulation runs can be published.`,
      );
    }

    if (!run) {
      throw new BiosimulationsException(
        HttpStatus.BAD_REQUEST,
        'Simulation run is not valid for publication.',
        `A simulation run with id '${id}' could not be found. Only successful simulation runs can be published.`,
      );
    }

    const errorDetails: string[] = [];
    const errorSummaries: string[] = [];

    /**
     * Check run
     */

    if (run.status !== SimulationRunStatus.SUCCEEDED) {
      errorDetails.push(
        `The run did not succeed. The status of the run is '${run.status}'.\
         Only successful simulation runs can be published.`,
      );
      errorSummaries.push(
        `The run did not succeed. The status of the run is '${run.status}'.\
         Only successful simulation runs can be published.`,
      );
    }

    if (!run.projectSize) {
      errorDetails.push(
        `The COMBINE archive for the run appears to be empty. An error may have occurred in saving the archive. \
        Archives must be properly saved for publication. If you believe this is incorrect, \
        please submit an issue at https://github.com/biosimulations/biosimulations/issues/new/choose.`,
      );
      errorSummaries.push(
        `The COMBINE archive for the run appears to be empty. An error may have occurred in saving the archive. \
        Archives must be properly saved for publication. If you believe this is incorrect, please submit an issue \
        at https://github.com/biosimulations/biosimulations/issues/new/choose.`,
      );
    }

    if (!run.resultsSize) {
      errorDetails.push(
        `The results for run appear to be empty. An error may have occurred in saving the results. \
        Results must be properly saved for publication. If you believe this is incorrect, \
        please submit an issue at https://github.com/biosimulations/biosimulations/issues/new/choose.`,
      );
      errorSummaries.push(
        `The results for run appear to be empty. An error may have occurred in saving the results. \
        Results must be properly saved for publication. If you believe this is incorrect, \
        please submit an issue at https://github.com/biosimulations/biosimulations/issues/new/choose.`,
      );
    }

    if (errorDetails.length) {
      throw new BiosimulationsException(
        HttpStatus.BAD_REQUEST,
        'Simulation run is not valid for publication.',
        errorSummaries.join('\n\n'),
      );
    }

    /**
     * Check files, SED-ML, results, logs, metadata
     */

    const checks: Check[] = [
      {
        check: this.filesService.getSimulationRunFiles(id),
        errorMessage: `Files (contents of COMBINE archive) could not be found for simulation run '${id}'.`,
        isValid: (files: FileModel[]): boolean => files.length > 0,
      },
      {
        check: this.specificationsService.getSpecificationsBySimulation(id),
        errorMessage: `Simulation specifications (SED-ML documents) could not be found for simulation run '${id}'. \
        For publication, simulation experiments must be valid SED-ML documents. \
        Please check that the SED-ML documents in the COMBINE archive are valid. \
        More information is available at https://docs.biosimulations.org/concepts/conventions/simulation-experiments/ \
        and https://run.biosimulations.org/utils/validate-project.`,
        isValid: (specifications: SpecificationsModel[]): boolean =>
          specifications.length > 0,
      },
      {
        check: this.resultsService.getResults(
          id,
          validateSimulationResultsData,
        ),
        errorMessage: `Simulation results could not be found for run '${id}'. \
        For publication, simulation runs produce at least one SED-ML report or plot.`,
        isValid: (results: Results): boolean => results?.outputs?.length > 0,
      },
      {
        check: this.logsService.getLog(id) as Promise<CombineArchiveLog>,
        errorMessage: `Simulation log could not be found for run '${id}'. \
        For publication, simulation runs must have validate logs. \
        More information is available at https://docs.biosimulations.org/concepts/conventions/simulation-run-logs/.`,
        isValid: (log: CombineArchiveLog): boolean => {
          return (
            log.status === SimulationRunLogStatus.SUCCEEDED && !!log.output
          );
        },
      },
      {
        check: this.metadataService.getMetadata(id),
        errorMessage: `Metadata could not be found for simulation run '${id}'. \
        For publication, simulation runs must meet BioSimulations' minimum metadata requirements. \
        More information is available at https://docs.biosimulations.org/concepts/conventions/simulation-project-metadata/ \
        and https://run.biosimulations.org/utils/validate-project.`,
        isValid: (metadata: SimulationRunMetadataIdModel | null): boolean => {
          if (!metadata) {
            return false;
          }
          const archiveMetadata = metadata.metadata.filter(
            (metadata: MetadataModel): boolean => {
              return metadata.uri.search('/') === -1;
            },
          );
          return archiveMetadata.length === 1;
        },
      },
    ];

    const checkResults: PromiseResult<any>[] = await Promise.all(
      checks.map((check: Check): Promise<PromiseResult<any>> => {
        return check.check
          .then((value) => {
            return {
              succeeded: true,
              value: value,
            };
          })
          .catch((error: AxiosError) => {
            return {
              succeeded: false,
              error: error,
            };
          });
      }),
    );

    const checksAreValid: boolean[] = [];
    for (let iCheck = 0; iCheck < checks.length; iCheck++) {
      const check = checks[iCheck];
      const result = checkResults[iCheck];
      let checkIsValid!: boolean;

      if (!result.succeeded) {
        const error = result?.error;
        errorDetails.push(
          `${check.errorMessage}: ${this.getErrorMessage(error)}`,
        );
        errorSummaries.push(check.errorMessage);
      } else if (result.value === undefined) {
        checkIsValid = false;
        errorDetails.push(check.errorMessage);
        errorSummaries.push(check.errorMessage);
      } else if (!check.isValid(result.value)) {
        checkIsValid = false;
        errorDetails.push(check.errorMessage);
        errorSummaries.push(check.errorMessage);
      } else {
        checkIsValid = true;
      }

      checksAreValid.push(checkIsValid);
    }

    /* check that there are results for all specified SED-ML reports and plots */
    if (
      checkResults[1].succeeded &&
      checkResults[1].value &&
      checkResults[2].succeeded &&
      checkResults[2].value &&
      checksAreValid[1] &&
      checksAreValid[2]
    ) {
      const specs: SpecificationsModel[] = checkResults[1].value;
      const results: Results = checkResults[2].value;

      const expectedDataSetUris = new Set<string>();
      specs.forEach((spec: SpecificationsModel): void => {
        let docLocation = spec.id;
        if (docLocation.startsWith('./')) {
          docLocation = docLocation.substring(2);
        }

        spec.outputs.forEach((output): void => {
          if (output._type === 'SedReport') {
            (output as SedReport).dataSets.forEach(
              (dataSet: SedDataSet): void => {
                expectedDataSetUris.add(
                  'Report DataSet: `' +
                    docLocation +
                    '/' +
                    output.id +
                    '/' +
                    dataSet.id +
                    '`',
                );
              },
            );
          } else if (output._type === 'SedPlot2D') {
            (output as SedPlot2D).curves.forEach((curve: SedCurve): void => {
              expectedDataSetUris.add(
                'Plot DataGenerator: `' +
                  docLocation +
                  '/' +
                  output.id +
                  '/' +
                  curve.xDataGenerator +
                  '`',
              );
              expectedDataSetUris.add(
                'Plot DataGenerator: `' +
                  docLocation +
                  '/' +
                  output.id +
                  '/' +
                  curve.yDataGenerator +
                  '`',
              );
            });
          } else {
            (output as SedPlot3D).surfaces.forEach(
              (surface: SedSurface): void => {
                expectedDataSetUris.add(
                  'Plot DataGenerator: `' +
                    docLocation +
                    '/' +
                    output.id +
                    '/' +
                    surface.xDataGenerator +
                    '`',
                );
                expectedDataSetUris.add(
                  'Plot DataGenerator: `' +
                    docLocation +
                    '/' +
                    output.id +
                    '/' +
                    surface.yDataGenerator +
                    '`',
                );
                expectedDataSetUris.add(
                  'Plot DataGenerator: `' +
                    docLocation +
                    '/' +
                    output.id +
                    '/' +
                    surface.zDataGenerator +
                    '`',
                );
              },
            );
          }
        });
      });

      const dataSetUris = new Set<string>();
      const unrecordedDatSetUris = new Set<string>();
      results.outputs.forEach((output: Output): void => {
        let docLocationOutputId = output.outputId;
        if (docLocationOutputId.startsWith('./')) {
          docLocationOutputId = docLocationOutputId.substring(2);
        }

        const type =
          output.type === 'SedReport' ? 'Report DataSet' : 'Plot DataGenerator';

        output.data.forEach((data: OutputData): void => {
          const uri = type + ': `' + docLocationOutputId + '/' + data.id + '`';
          dataSetUris.add(uri);
          if (validateSimulationResultsData && !Array.isArray(data.values)) {
            unrecordedDatSetUris.add(uri);
          }
        });
      });

      const unproducedDatSetUris = [...expectedDataSetUris].filter(
        (uri) => !dataSetUris.has(uri),
      );

      if (expectedDataSetUris.size === 0) {
        errorDetails.push(
          'Simulation run does not specify any SED-ML reports or plots. \
          For publication, simulation runs must produce data for at least one SED-ML report or plot.',
        );
        errorSummaries.push(
          'Simulation run does not specify any SED-ML reports or plots. \
          For publication, simulation runs must produce data for at least one SED-ML report or plot.',
        );
      } else if (unproducedDatSetUris.length) {
        unproducedDatSetUris.sort();
        errorDetails.push(
          'One or more data sets of reports or data generators of plots was not recorded. ' +
            'For publication, there must be simulation results for each data set and data ' +
            'generator specified in each SED-ML documents in the COMBINE archive. The ' +
            'following data sets and data generators were not recorded.\n\n  * ' +
            unproducedDatSetUris.join('\n  * '),
        );
        errorSummaries.push(
          'One or more data sets of reports or data generators of plots was not recorded. ' +
            'For publication, there must be simulation results for each data set and data ' +
            'generator specified in each SED-ML documents in the COMBINE archive. The ' +
            'following data sets and data generators were not recorded.\n\n  * ' +
            unproducedDatSetUris.join('\n  * '),
        );
      } else if (unrecordedDatSetUris.size) {
        errorDetails.push(
          'Data was not recorded for the following data sets for reports and data generators for plots.\n\n  * ' +
            Array.from(unrecordedDatSetUris).sort().join('\n  * '),
        );
        errorSummaries.push(
          'Data was not recorded for the following data sets for reports and data generators for plots.\n\n  * ' +
            Array.from(unrecordedDatSetUris).sort().join('\n  * '),
        );
      }
    }

    if (errorDetails.length) {
      this.logger.error(
        `Simulation run is not valid for publication:\n\n  ${errorDetails.join(
          '\n\n  ',
        )}`,
      );
      throw new BiosimulationsException(
        HttpStatus.BAD_REQUEST,
        'Simulation run is not valid for publication.',
        errorSummaries.join('\n\n'),
      );
    }

    /* return if valid */
    return;
  }

  private getErrorMessage(error: any): string {
    if (error?.isAxiosError) {
      return `${error?.response?.status}: ${
        error?.response?.data?.detail || error?.response?.statusText
      }`;
    } else {
      return `${error?.status || error?.statusCode || error.constructor.name}: ${error?.message}`;
    }
  }
}
