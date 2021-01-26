import {
  CombineArchiveLog,
  CreateSimulationRunLogBody,
  SimulationRun,
  SimulationRunReport,
  SimulationRunReportDataStrings,
} from '@biosimulations/dispatch/api-models';
import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthClientService } from '@biosimulations/auth/client';
import {
  pluck,
  map,
  mergeMap,
} from 'rxjs/operators';
import { from, Observable } from 'rxjs';
import {
  SimulationRunStatus,
} from '@biosimulations/datamodel/common';
@Injectable({})
export class SimulationRunService {
  constructor(
    private auth: AuthClientService,
    private http: HttpService,
    private configService: ConfigService,
  ) {}
  endpoint = this.configService.get('urls').dispatchApi;

  updateSimulationRunStatus(
    id: string,
    status: SimulationRunStatus,
  ): Observable<SimulationRun> {
    return from(this.auth.getToken()).pipe(
      map((token) => {
        return this.http
          .patch<SimulationRun>(
            `${this.endpoint}run/${id}`,
            { status: status },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          )
          .pipe(pluck('data'));
      }),
      mergeMap((value) => value),
    );
  }

  async updateSimulationRunResultsSize(
    id: string,
    size: number,
  ): Promise<SimulationRun> {
    const token = await this.auth.getToken();
    return this.http
      .patch<SimulationRun>(
        `${this.endpoint}run/${id}`,
        { resultsSize: size },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .pipe(pluck('data'))
      .toPromise();
  }
  async getJob(simId: string): Promise<SimulationRun> {
    // TODO make enpoint consistent with other (no ending /)
    const token = await this.auth.getToken();
    return this.http
      .get<SimulationRun>(`${this.endpoint}/run/${simId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .pipe(pluck('data'))
      .toPromise();
  }
  async sendReport(
    simId: string,
    reportId: string,
    data: SimulationRunReportDataStrings,
  ): Promise<SimulationRunReport> {
    const token = await this.auth.getToken();

    return this.http
      .post<SimulationRunReport>(
        `${this.endpoint}results/${simId}/${reportId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .pipe(pluck('data'))
      .toPromise();
  }

  sendLog(
    simId: string,
    log: CombineArchiveLog,
  ): Observable<CombineArchiveLog> {
    const body: CreateSimulationRunLogBody = {
      simId: simId,
      log: log,
    };

    return from(this.auth.getToken()).pipe(
      map((token) => {
        return this.http
          .post(`${this.endpoint}logs/`, body, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .pipe(pluck('data'));
      }),
      mergeMap((value) => value),
    );
  }
}
