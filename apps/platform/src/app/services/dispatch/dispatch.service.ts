import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, shareReplay } from 'rxjs/operators';
import { Endpoints } from '@biosimulations/config/common';
import { UploadSimulationRun, UploadSimulationRunUrl } from '@biosimulations/datamodel/common';
import { SimulationLogs } from '../../simulation-logs-datamodel';
import {
  SimulationRunLogStatus,
  Purpose,
  EnvironmentVariable,
  SimulationRun,
  CombineArchiveLog,
} from '@biosimulations/datamodel/common';
import { environment } from '@biosimulations/shared/environments';
import { SimulationRunService } from '@biosimulations/angular-api-client';

@Injectable({
  providedIn: 'root',
})
export class DispatchService {
  public endpoints = new Endpoints();

  public submitJobForURL(
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
    return this.http.post<SimulationRun>(this.endpoints.getSimulationRunEndpoint(false), body, {
      headers: { 'Content-Type': 'application/json' },
    });
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

    return this.http.post<SimulationRun>(this.endpoints.getSimulationRunEndpoint(false), formData);
  }

  public getSimulationLogs(uuid: string): Observable<SimulationLogs | undefined | false> {
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

      catchError((error: HttpErrorResponse): Observable<false> => {
        if (!environment.production) {
          console.error(error);
        }
        return of<false>(false);
      }),

      shareReplay(1),
    );
  }

  public constructor(private http: HttpClient, private simRunService: SimulationRunService) {
    /* Constructor is empty */
  }
}
