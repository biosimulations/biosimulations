import { urls } from '@biosimulations/config/common';
import { SimulationRunStatus } from '@biosimulations/dispatch/api-models';
import { HttpService, Injectable } from '@nestjs/common';
import { AuthService } from '../services/auth/auth.service';

@Injectable({})
export class SimulationRunService {
  constructor(private auth: AuthService, private http: HttpService) {}

  // TODO Change this over to observable to allow for chaining/error handling
  async updateSimulationRunStatus(id: string, status: SimulationRunStatus) {
    const token = await this.auth.getToken();
    return this.http
      .patch(
        `${urls.dispatchApi}run/${id}`,
        { status: status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .toPromise();
  }

  async updateSimulationRunSize(id: string, size: number) {
    const token = await this.auth.getToken();
    return this.http
      .patch(
        `${urls.dispatchApi}run/${id}`,
        { status: status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .toPromise();
  }
}
