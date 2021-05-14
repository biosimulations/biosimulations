import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError, shareReplay } from 'rxjs/operators';
import { urls } from '@biosimulations/config/common';
// import { Simulator } from '@biosimulations/simulators/api-models';
import {
  SimulationRun,
  UploadSimulationRun,
  UploadSimulationRunUrl,
} from '@biosimulations/dispatch/api-models';
import {
  SimulationLogs,
  CombineArchiveLog,
} from '../../simulation-logs-datamodel';
import { SimulationRunLogStatus } from '@biosimulations/datamodel/common';
import { OntologyService } from '../ontology/ontology.service';
import {
  EdamTerm,
  KisaoTerm,
  SboTerm,
  ValueType,
} from '@biosimulations/datamodel/common';
import { parseValue, formatValue } from '@biosimulations/datamodel/utils';
import { environment } from '@biosimulations/shared/environments';

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
  private endpoint = `${urls.dispatchApi}run/`;

  public sumbitJobURL(
    url: string,
    simulator: string,
    simulatorVersion: string,
    cpus: number,
    memory: number, // in GB
    maxTime: number, // in minutes
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
      public: false,
    };
    return this.http.post<SimulationRun>(this.endpoint, body, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  public submitJob(
    fileToUpload: File,
    simulator: string,
    simulatorVersion: string,
    cpus: number,
    memory: number, // in GB
    maxTime: number, // in minutes
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
      public: false,
    };
    formData.append('file', fileToUpload, fileToUpload.name);
    formData.append('simulationRun', JSON.stringify(run));

    const response = this.http.post(
      this.endpoint,
      formData,
    ) as Observable<SimulationRun>;
    return response;
  }

  // TODO Remove all of these hardcoded paths
  public getAllSimulatorInfo(simulatorName?: string): Observable<string[]> {
    const endpoint = `${urls.dispatchApi}simulators`;
    if (simulatorName === undefined) {
      return this.http.get(endpoint) as Observable<string[]>;
    }
    return this.http.get(`${endpoint}?name=${simulatorName}`) as Observable<
      string[]
    >;
  }

  public getSimulatorsFromDb(): Observable<SimulatorsData> {
    const endpoint = `https://api.biosimulators.org/simulators`;
    const promises = [
      this.http.get(endpoint),
      this.ontologyService.edamTerms,
      this.ontologyService.kisaoTerms,
      this.ontologyService.sboTerms,
    ];

    return forkJoin(promises).pipe(
      map(
        (resolvedPromises): SimulatorsData => {
          const simulatorSpecs = resolvedPromises[0] as any[]; // Simulator[]
          const edamTerms = resolvedPromises[1] as { [id: string]: EdamTerm };
          const kisaoTerms = resolvedPromises[2] as { [id: string]: KisaoTerm };
          const sboTerms = resolvedPromises[3] as { [id: string]: SboTerm };

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
        },
      ),
      shareReplay(1),
    );
  }

  public getSimulationLogs(
    uuid: string,
  ): Observable<SimulationLogs | undefined> {
    const endpoint = `${urls.dispatchApi}logs/${uuid}?download=false`;
    return this.http.get<CombineArchiveLog>(endpoint).pipe(
      map(
        (response: CombineArchiveLog): SimulationLogs => {
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
        },
      ),

      catchError(
        (error: HttpErrorResponse): Observable<undefined> => {
          if (!environment.production) {
            console.error(error);
          }
          return of<undefined>(undefined);
        },
      ),
    );
  }

  public constructor(
    private http: HttpClient,
    private ontologyService: OntologyService,
  ) {}
}
