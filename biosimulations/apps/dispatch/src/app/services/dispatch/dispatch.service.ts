import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { urls } from '@biosimulations/config/common';
import { map } from 'rxjs/operators';
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

@Injectable({
  providedIn: 'root',
})
export class DispatchService {
  endpoint = `${urls.dispatchApi}run/`;

  sumbitJobURL(
    url: string,
    simulator: string,
    simulatorVersion: string,
    cores: number,
    ramGb: number,
    walltimeMin: number,
    name: string,
    email: string | null,
  ): Observable<SimulationRun> {
    /* Todo: send cores, RAM, walltime info to simulation system */
    const body: UploadSimulationRunUrl = {
      url,
      name,
      email,
      simulator,
      simulatorVersion,
    };
    return this.http.post<SimulationRun>(this.endpoint, body, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  submitJob(
    fileToUpload: File,
    simulator: string,
    simulatorVersion: string,
    cores: number,
    ramGb: number,
    walltimeMin: number,
    name: string,
    email: string | null,
  ): Observable<SimulationRun> {
    const formData = new FormData();

    /* Todo: send cores, RAM, walltime info to simulation system */
    const run: UploadSimulationRun = {
      name: name,
      email: email,
      simulator,
      simulatorVersion,
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

  getSimulatorsFromDb(): Observable<SimulatorSpecsMap> {
    const endpoint = `https://api.biosimulators.org/simulators`;

    return this.http.get(endpoint).pipe(
      map(
        (response: any): SimulatorSpecsMap => {
          // response to dict logic
          const simulatorSpecsMap: SimulatorSpecsMap = {};

          for (const simulator of response) {
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
                    (format: any): void => {
                      return format.id;
                    },
                  ),
                  algorithmKisaoIds: [algorithm.kisaoId.id],
                });
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

          return simulatorSpecsMap;
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

  constructor(private http: HttpClient) {}
}
