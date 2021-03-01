import {
  CombineArchiveLog,
  CreateSimulationRunLogBody,
  SimulationRun,
  SimulationRunReport,
  SimulationRunReportDataStrings,
} from '@biosimulations/dispatch/api-models';
import { HttpService, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthClientService } from '@biosimulations/auth/client';
import { pluck, map, mergeMap, retry, catchError } from 'rxjs/operators';
import { from, Observable } from 'rxjs';
import { SimulationRunStatus } from '@biosimulations/datamodel/common';
@Injectable({})
export class SimulationRunService {
  private endpoint = this.configService.get('urls').dispatchApi;

  public constructor(
    private auth: AuthClientService,
    private http: HttpService,
    private configService: ConfigService,
  ) {}
  private logger = new Logger(SimulationRunService.name);

  public updateSimulationRunStatus(
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

  public updateSimulationRunResultsSize(
    id: string,
    size: number,
  ): Observable<SimulationRun> {
    return from(this.auth.getToken()).pipe(
      map((token) => {
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
          .pipe(
            catchError((err, caught) => {
              this.logger.error(err);
              return caught;
            }),
            retry(2),
            pluck('data'),
          );
      }),
      mergeMap((value) => value),
    );
  }
  public async getJob(simId: string): Promise<SimulationRun> {
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
  // TODO Change return type to observable
  public async sendReport(
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

  public sendLog(
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
