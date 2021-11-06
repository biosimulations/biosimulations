import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, forkJoin, of, ObservableInput } from 'rxjs';
import { map, catchError, shareReplay } from 'rxjs/operators';
import { Endpoints } from '@biosimulations/config/common';

import {
  UploadSimulationRun,
  UploadSimulationRunUrl,
} from '@biosimulations/datamodel/common';
import { SimulationLogs } from '../../simulation-logs-datamodel';
import {
  Ontologies,
  OntologyTermMap,
  SimulationRunLogStatus,
  Purpose,
  EnvironmentVariable,
  SimulationRun,
  CombineArchiveLog,
} from '@biosimulations/datamodel/common';
import { OntologyService } from '@biosimulations/ontology/client';
import {
  EdamTerm,
  KisaoTerm,
  SboTerm,
  ValueType,
  SimulationType,
} from '@biosimulations/datamodel/common';
import { parseValue, formatValue } from '@biosimulations/datamodel/utils';
import { environment } from '@biosimulations/shared/environments';
import { ISimulator } from '@biosimulations/datamodel/common';
import { SimulationRunService } from '@biosimulations/angular-api-client';

export interface AlgorithmParameter {
  id: string;
  name: string;
  url: string;
  type: ValueType;
  value: string | null;
  formattedValue: string;
  recommendedRange: string[] | null;
  formattedRecommendedRange: string[];
  formattedRecommendedRangeJoined: string;
}

export interface ModelingFrameworksAlgorithmsForModelFormat {
  formatEdamIds: string[];
  frameworkSboIds: string[];
  simulationTypes: SimulationType[];
  algorithmKisaoIds: string[];
  parameters: AlgorithmParameter[];
}

export interface SimulatorSpecs {
  id: string;
  name: string;
  versions: string[];
  modelingFrameworksAlgorithmsForModelFormats: ModelingFrameworksAlgorithmsForModelFormat[];
}

export interface SimulatorSpecsMap {
  [id: string]: SimulatorSpecs;
}

export interface OntologyTerm {
  id: string;
  name: string;
  simulators: Set<string>;
  disabled: boolean;
}

export interface OntologyTermsMap {
  [id: string]: OntologyTerm;
}

export interface SimulatorsData {
  simulatorSpecs: SimulatorSpecsMap;
  modelFormats: OntologyTermsMap;
  modelingFrameworks: OntologyTermsMap;
  simulationAlgorithms: OntologyTermsMap;
}

@Injectable({
  providedIn: 'root',
})
export class DispatchService {
  private endpoints = new Endpoints();

  public sumbitJobForURL(
    url: string,
    simulator: string,
    simulatorVersion: string,
    cpus: number,
    memory: number, // in GB
    maxTime: number, // in minutes
    envVars: EnvironmentVariable[],
    purpose: Purpose,
    name: string,
    email: string | null,
  ): Observable<SimulationRun> {
    const body: UploadSimulationRunUrl = {
      url,
      name,
      email,
      simulator,
      simulatorVersion,
      cpus,
      memory,
      maxTime,
      envVars,
      purpose,
      projectId: undefined,
    };
    return this.http.post<SimulationRun>(
      this.endpoints.getSimulationRunEndpoint(),
      body,
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }

  public submitJobForFile(
    fileToUpload: File,
    simulator: string,
    simulatorVersion: string,
    cpus: number,
    memory: number, // in GB
    maxTime: number, // in minutes
    envVars: EnvironmentVariable[],
    purpose: Purpose,
    name: string,
    email: string | null,
  ): Observable<SimulationRun> {
    const formData = new FormData();

    const run: UploadSimulationRun = {
      name: name,
      email: email,
      simulator,
      simulatorVersion,
      cpus,
      memory,
      maxTime,
      envVars,
      purpose,
      projectId: undefined,
    };
    formData.append('file', fileToUpload, fileToUpload.name);
    formData.append('simulationRun', JSON.stringify(run));

    const response = this.http.post<SimulationRun>(
      this.endpoints.getSimulationRunEndpoint(),
      formData,
    );
    return response;
  }

  private simulatorsDataCache?: Observable<SimulatorsData>;

  public getSimulatorsFromDb(): Observable<SimulatorsData> {
    if (this.simulatorsDataCache) {
      return this.simulatorsDataCache;
    }

    const endpoint = this.endpoints.getSimulatorsEndpoint(
      undefined,
      undefined,
      false,
    );
    const promises: {
      simulatorSpecs: ObservableInput<ISimulator[]>;
      edamTerms: ObservableInput<OntologyTermMap<EdamTerm>>;
      kisaoTerms: ObservableInput<OntologyTermMap<KisaoTerm>>;
      sboTerms: ObservableInput<OntologyTermMap<SboTerm>>;
    } = {
      simulatorSpecs: this.http
        .get<ISimulator[]>(endpoint)
        .pipe(shareReplay(1)),
      edamTerms: this.ontologyService.getOntologyTerms(Ontologies.EDAM),
      kisaoTerms: this.ontologyService.getOntologyTerms(Ontologies.KISAO),
      sboTerms: this.ontologyService.getOntologyTerms(Ontologies.SBO),
    };

    this.simulatorsDataCache = forkJoin(promises).pipe(
      map((resolvedPromises): SimulatorsData => {
        const simulatorSpecs = resolvedPromises.simulatorSpecs; // ISimulator[]
        const edamTerms = resolvedPromises.edamTerms;
        const kisaoTerms = resolvedPromises.kisaoTerms;
        const sboTerms = resolvedPromises.sboTerms;
        const getKisaoTermName = (id: string): string => {
          return kisaoTerms[id].name;
        };

        // response to dict logic
        const simulatorSpecsMap: SimulatorSpecsMap = {};
        const modelFormats: OntologyTermsMap = {};
        const modelingFrameworks: OntologyTermsMap = {};
        const simulationAlgorithms: OntologyTermsMap = {};

        for (const simulator of simulatorSpecs) {
          if (simulator?.image && simulator?.biosimulators?.validated) {
            if (!(simulator.id in simulatorSpecsMap)) {
              simulatorSpecsMap[simulator.id] = {
                id: simulator.id,
                name: simulator.name,
                versions: [],
                modelingFrameworksAlgorithmsForModelFormats: [],
              };
            }
            simulatorSpecsMap[simulator.id].versions.push(simulator.version);
            simulator.algorithms.forEach((algorithm: any): void => {
              simulatorSpecsMap[
                simulator.id
              ].modelingFrameworksAlgorithmsForModelFormats.push({
                formatEdamIds: algorithm.modelFormats.map(
                  (format: any): void => {
                    return format.id;
                  },
                ),
                frameworkSboIds: algorithm.modelingFrameworks.map(
                  (framework: any): void => {
                    return framework.id;
                  },
                ),
                simulationTypes: algorithm.simulationTypes,
                algorithmKisaoIds: [algorithm.kisaoId.id],
                parameters: algorithm.parameters.map(
                  (param: any): AlgorithmParameter => {
                    return {
                      id: param.kisaoId.id,
                      name: kisaoTerms[param.kisaoId.id].name,
                      url: kisaoTerms[param.kisaoId.id].url,
                      type: param.type,
                      value: param.value,
                      formattedValue: param.value
                        ? formatValue(
                            param.type,
                            parseValue<string>(
                              getKisaoTermName,
                              param.type,
                              param.value,
                            ),
                          ) || ''
                        : '',
                      recommendedRange: param.recommendedRange,
                      formattedRecommendedRange: param.recommendedRange
                        ? param.recommendedRange.map(
                            (value: string): string => {
                              return formatValue(
                                param.type,
                                parseValue<string>(
                                  getKisaoTermName,
                                  param.type,
                                  value,
                                ),
                              ) as string;
                            },
                          )
                        : ['--none--'],
                      formattedRecommendedRangeJoined: param.recommendedRange
                        ? param.recommendedRange
                            .map((value: string): string => {
                              return formatValue(
                                param.type,
                                parseValue<string>(
                                  getKisaoTermName,
                                  param.type,
                                  value,
                                ),
                              ) as string;
                            })
                            .join(', ')
                        : '--none--',
                    };
                  },
                ),
              });

              algorithm.modelFormats.forEach((format: any): void => {
                if (!(format.id in modelFormats)) {
                  modelFormats[format.id] = {
                    id: format.id,
                    name: edamTerms?.[format.id]?.name || format.id,
                    simulators: new Set<string>(),
                    disabled: false,
                  };
                }
                modelFormats[format.id].simulators.add(simulator.id);
              });

              algorithm.modelingFrameworks.forEach((framework: any): void => {
                if (!(framework.id in modelingFrameworks)) {
                  modelingFrameworks[framework.id] = {
                    id: framework.id,
                    name: sboTerms?.[framework.id]?.name || framework.id,
                    simulators: new Set<string>(),
                    disabled: false,
                  };
                }
                modelingFrameworks[framework.id].simulators.add(simulator.id);
              });

              if (!(algorithm.kisaoId.id in simulationAlgorithms)) {
                simulationAlgorithms[algorithm.kisaoId.id] = {
                  id: algorithm.kisaoId.id,
                  name:
                    kisaoTerms?.[algorithm.kisaoId.id]?.name || algorithm.id,
                  simulators: new Set<string>(),
                  disabled: false,
                };
              }
              simulationAlgorithms[algorithm.kisaoId.id].simulators.add(
                simulator.id,
              );
            });
          }
        }

        for (const simulatorSpecs of Object.values(simulatorSpecsMap)) {
          simulatorSpecs.versions
            .sort((a: string, b: string): number => {
              return a.localeCompare(b, undefined, { numeric: true });
            })
            .reverse();
        }

        return {
          simulatorSpecs: simulatorSpecsMap,
          modelFormats,
          modelingFrameworks,
          simulationAlgorithms,
        };
      }),
      shareReplay(1),
    );

    return this.simulatorsDataCache;
  }

  public getSimulationLogs(
    uuid: string,
  ): Observable<SimulationLogs | undefined> {
    return this.simRunService.getSimulationRunLog(uuid).pipe(
      map((response: CombineArchiveLog): SimulationLogs => {
        // get structured log
        let structuredLog: CombineArchiveLog | undefined = response;

        const rawLog = response.output || structuredLog?.output || '';
        if (structuredLog.status == SimulationRunLogStatus.UNKNOWN) {
          structuredLog = undefined;
        }

        // return combined log
        return {
          raw: rawLog,
          structured: structuredLog,
        };
      }),

      catchError((error: HttpErrorResponse): Observable<undefined> => {
        if (!environment.production) {
          console.error(error);
        }
        return of<undefined>(undefined);
      }),

      shareReplay(1),
    );
  }

  public constructor(
    private http: HttpClient,
    private simRunService: SimulationRunService,
    private ontologyService: OntologyService,
  ) {}
}
