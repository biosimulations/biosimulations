import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { urls } from '@biosimulations/config/common';
import { map } from 'rxjs/operators';
import {
  SimulationRun,
  UploadSimulationRun,
} from '@biosimulations/dispatch/api-models';
import {
  SimulationLogs,
  CombineArchiveLog,
} from '../../simulation-logs-datamodel';
import { SimulationRunLogStatus } from '@biosimulations/datamodel/common';

export interface ModelingFrameworksForModelFormat {
  formatEdamIds: string[];
  frameworkSboIds: string[];
}

export interface SimulatorSpecs {
  versions: string[];
  modelingFrameworksForModelFormats: ModelingFrameworksForModelFormat[];
}

export interface SimulatorSpecsMap {
  [id: string]: SimulatorSpecs;
}

@Injectable({
  providedIn: 'root',
})
export class DispatchService {
  uuidUpdateEvent = new Subject<string>();
  uuidsDispatched: Array<string> = [];

  submitJob(
    fileToUpload: File,
    selectedSimulator: string,
    selectedVersion: string,
    name: string,
    email: string,
  ): Observable<SimulationRun> {
    const endpoint = `${urls.dispatchApi}run/`;

    const formData = new FormData();

    const run: UploadSimulationRun = {
      name: name,
      email: email || null,
      simulator: selectedSimulator,
      simulatorVersion: selectedVersion,
    };
    formData.append('file', fileToUpload, fileToUpload.name);
    formData.append('simulationRun', JSON.stringify(run));

    const response = this.http.post(
      endpoint,
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
                  modelingFrameworksForModelFormats: [],
                };
              }
              simulatorSpecsMap[simulator.id].versions.push(simulator.version);
              simulator.algorithms.forEach((algorithm: any): void => {
                simulatorSpecsMap[
                  simulator.id
                ].modelingFrameworksForModelFormats.push({
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
