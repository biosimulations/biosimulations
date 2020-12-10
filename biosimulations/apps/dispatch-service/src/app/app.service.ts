import { HttpService, Injectable, Logger } from '@nestjs/common';
import { urls } from '@biosimulations/config/common';
import { ConfigService } from '@nestjs/config';
import { SimulationRunStatus } from '@biosimulations/dispatch/api-models';
import { AuthService } from './services/auth/auth.service';
// TODO replace calls to this service with the submission service
@Injectable()
export class AppService {
  constructor(private http: HttpService, private auth: AuthService) {}

  async updateSimulationInDb(
    simId: string,
    data: {
      public?: boolean;
      status?: SimulationRunStatus;
      resultsSize?: number;
    }
  ): Promise<any> {
    const finalData: any = {};

    if (data.public !== null) {
      finalData.public = data.public;
    }

    if (data.resultsSize) {
      finalData.resultsSize = data.resultsSize;
    }

    if (data.status) {
      finalData.status = data.status;
    }
    const token = await this.auth.getToken();
    return this.http
      .patch(`${urls.dispatchApi}run/${simId}`, finalData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .toPromise();
  }
}
