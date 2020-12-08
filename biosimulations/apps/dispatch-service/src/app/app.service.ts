import { HttpService, Injectable, Logger } from '@nestjs/common';
import { urls } from '@biosimulations/config/common';
import { ConfigService } from '@nestjs/config';
import { SimulationRunStatus } from '@biosimulations/dispatch/api-models';

@Injectable()
export class AppService {
  private authConfig: any = this.configService.get('auth', {});
  private logger = new Logger(AppService.name);
  constructor(
    private http: HttpService,
    private readonly configService: ConfigService
  ) {}

  async updateSimulationInDb(
    simId: string,
    data: {
      public?: boolean;
      status?: SimulationRunStatus;
      endTime?: number;
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

    if (data.endTime) {
      const simData: any = await this.getSimulationFromDB(simId);
      const runDuration =
        (data.endTime - new Date(simData.submitted).getTime()) / 1000;
      finalData.runtime = runDuration;
    }

    if (data.status) {
      finalData.status = data.status;
    }
    const token = await this.getAuthTokenForAPI();
    return this.http
      .patch(`${urls.dispatchApi}run/${simId}`, finalData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .toPromise();
  }

  private async getAuthTokenForAPI(): Promise<string> {
    const res: any = await this.http
      .post(`${this.authConfig.auth0_domain}oauth/token`, {
        client_id: this.authConfig.client_id,
        client_secret: this.authConfig.client_secret,
        audience: this.authConfig.api_audience,
        grant_type: 'client_credentials',
      })
      .toPromise();
    return res.data.access_token;
  }

  private async getSimulationFromDB(simId: string) {
    const token = this.getAuthTokenForAPI();
    const simRes = await this.http
      .get(`${urls.dispatchApi}run/${simId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .toPromise();
    return simRes.data;
  }
}
