import { urls } from '@biosimulations/config/common';
import {
  SimulationRunReportDataStrings,
  SimulationRunStatus
} from '@biosimulations/dispatch/api-models';
import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../services/auth/auth.service';

@Injectable({})
export class SimulationRunService {
  constructor(private auth: AuthService, private http: HttpService) {}
  // TODO use config service
  endpoint = process.env.DISPATCH_URL;
  // TODO Change this over to observable to allow for chaining/error handling
  async updateSimulationRunStatus(id: string, status: SimulationRunStatus) {
    const token = await this.auth.getToken();

    return this.http
      .patch(
        `${this.endpoint}run/${id}`,
        { status: status },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      .toPromise();
  }

  async updateSimulationRunResultsSize(id: string, size: number) {
    const token = await this.auth.getToken();
    return this.http
      .patch(
        `${this.endpoint}run/${id}`,
        { resultsSize: size },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      .toPromise();
  }

  async sendReport(
    simId: string,
    reportId: string,
    data: SimulationRunReportDataStrings
  ) {
    const token = await this.auth.getToken();
    return this.http
      .post(`${this.endpoint}results/${simId}/${reportId}`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .toPromise();
  }
}
