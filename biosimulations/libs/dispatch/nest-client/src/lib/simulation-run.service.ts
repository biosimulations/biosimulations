import {
    SimulationRun,
    SimulationRunReport,
    SimulationRunReportDataStrings,
    SimulationRunStatus
} from '@biosimulations/dispatch/api-models';
import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthClientService } from '@biosimulations/auth/client'
import { catchError, pluck, retry, } from 'rxjs/operators'
import { Observable, of } from 'rxjs';
@Injectable({})
export class SimulationRunService {
    constructor(private auth: AuthClientService, private http: HttpService, private configService: ConfigService) { }
    endpoint = this.configService.get('urls').dispatchApi

    async updateSimulationRunStatus(id: string, status: SimulationRunStatus): Promise<SimulationRun | void> {
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
            .pipe(pluck('data')).toPromise().catch(err => {
                console.error("Failed to update status")
                return
            });
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
    async getJob(simId: string): Promise<Observable<SimulationRun>> {
        const token = await this.auth.getToken();
        return this.http.get<SimulationRun>(
            `${this.endpoint}/runs/${simId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
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
