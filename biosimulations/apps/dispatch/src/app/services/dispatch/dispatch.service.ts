import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
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
  SboTerm
} from '@biosimulations/datamodel/common';

export interface ModelingFrameworksAlgorithmsForModelFormat {
  formatEdamIds: string[];
  frameworkSboIds: string[];
  algorithmKisaoIds: string[];
}

export interface SimulatorSpecs {
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
  endpoint = `${urls.dispatchApi}run/`;

  sumbitJobURL(
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
    };
    return this.http.post<SimulationRun>(this.endpoint, body, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  submitJob(
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
    };
    formData.append('file', fileToUpload, fileToUpload.name);
    formData.append('simulationRun', JSON.stringify(run));

    const response = this.http.post(
      this.endpoint,
      formData,
    ) as Observable<SimulationRun>;
    return response;
  }

  getAllSimulatorInfo(simulatorName?: string): Observable<string[]> {
    const endpoint = `${urls.dispatchApi}simulators`;
    if (simulatorName === undefined) {
      return this.http.get(endpoint) as Observable<string[]>;
    }
    return this.http.get(`${endpoint}?name=${simulatorName}`) as Observable<
      string[]
    >;
  }

  getSimulatorsFromDb(): Observable<SimulatorsData> {
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
          const edamTerms = resolvedPromises[1] as {[id: string]: EdamTerm};
          const kisaoTerms = resolvedPromises[2] as {[id: string]: KisaoTerm};
          const sboTerms = resolvedPromises[3] as {[id: string]: SboTerm};

          // response to dict logic
          const simulatorSpecsMap: SimulatorSpecsMap = {};
          const modelFormats: OntologyTermsMap = {};
          const modelingFrameworks: OntologyTermsMap = {};
          const simulationAlgorithms: OntologyTermsMap = {};

          for (const simulator of simulatorSpecs) {
            if (simulator?.image && simulator?.biosimulators?.validated) {
              if (!(simulator.id in simulatorSpecsMap)) {
                simulatorSpecsMap[simulator.id] = {
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
                });

                // TODO: get names of ontology terms

                algorithm.modelFormats.forEach((format: any): void => {
                  if (!(format.id in modelFormats)) {
                    modelFormats[format.id] = {
                      id: format.id,
                      name: edamTerms?.[format.id]?.name || format.id,
                      simulators: new Set<string>(),
                      disabled: false,
                    }
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
                    }
                  }
                  modelingFrameworks[framework.id].simulators.add(simulator.id);
                });

                if (!(algorithm.kisaoId.id in simulationAlgorithms)) {
                  simulationAlgorithms[algorithm.kisaoId.id] = {
                    id: algorithm.kisaoId.id,
                    name: kisaoTerms?.[algorithm.kisaoId.id]?.name || algorithm.id,
                    simulators: new Set<string>(),
                    disabled: false,
                  }
                }
                simulationAlgorithms[algorithm.kisaoId.id].simulators.add(simulator.id);
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
    );
  }

  getSimulationLogs(uuid: string): Observable<SimulationLogs> {
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
    );
  }

  constructor(private http: HttpClient, private ontologyService: OntologyService) {}
}
