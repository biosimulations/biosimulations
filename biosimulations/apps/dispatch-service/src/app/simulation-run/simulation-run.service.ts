import {
  SimulationRun,
  SimulationRunReport,
  SimulationRunReportDataStrings,
  SimulationRunStatus
} from '@biosimulations/dispatch/api-models';
import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../services/auth/auth.service';
import { pluck, retry, } from 'rxjs/operators'
import { Observable } from 'rxjs';
@Injectable({})
export class SimulationRunService {
  constructor(private auth: AuthService, private http: HttpService) { }
  // TODO use config service
  endpoint = process.env.DISPATCH_URL;
  // TODO Change this over to observable to allow for chaining/error handling
  async updateSimulationRunStatus(id: string, status: SimulationRunStatus): Promise<SimulationRun> {
    const token = await this.auth.getToken();

    return this.http
      .patch<SimulationRun>(
        `${this.endpoint}run/${id}`,
        { status: status },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      .pipe(pluck('data')).toPromise();
  }

  async updateSimulationRunResultsSize(id: string, size: number): Promise<SimulationRun> {
    const token = await this.auth.getToken();
    return this.http
      .patch<SimulationRun>(
        `${this.endpoint}run/${id}`,
        { resultsSize: size },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      .pipe(pluck('data')).toPromise();
  }
  getJob(simId: String): Observable<SimulationRun> {
    return this.http.get<SimulationRun>(
      `${this.endpoint}/runs/${simId}`
    ).pipe(pluck('data'))
  }
  async sendReport(
    simId: string,
    reportId: string,
    data: SimulationRunReportDataStrings
  ) {
    const token = await this.auth.getToken();
    return this.http
      .post<SimulationRunReport>(`${this.endpoint}results/${simId}/${reportId}`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .toPromise();
  }
}
