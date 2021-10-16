import { Injectable } from '@angular/core';
import { SystemStatus, SystemService } from '@biosimulations/datamodel/common';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable()
export class SystemStatusService {
  private static STATUS_ENDPOINT = 'https://raw.githubusercontent.com/biosimulations/status-monitor/master/history/summary.json';
  private static STATUS_SLUG_KEY_MAP: {[slug: string]: keyof SystemStatus} = {
    'biosimulations-api': 'biosimulationsApi',
    'bio-simulators-api': 'biosimulatorsApi',
    'combine-api': 'combineApi',
    'ingress-loadbalancer': 'ingressLoadBalancer',
    'storage-buckets': 'storageBuckets',
    'backend': 'backend',
  }

  constructor(private http: HttpClient) {}

  getSystemStatus(): Observable<SystemStatus> {
    return this.http.get<any[]>(SystemStatusService.STATUS_ENDPOINT).pipe(
      map((statusDetails: any[]): SystemStatus => {
        const status: SystemStatus = {
          biosimulationsApi: true,
          biosimulatorsApi: true,
          combineApi: true,
          ingressLoadBalancer: true,
          storageBuckets: true,
          backend: true,
        };

        statusDetails.forEach((statusDetail: any): void => {
          status[SystemStatusService.STATUS_SLUG_KEY_MAP[statusDetail.slug as string]] = statusDetail.status === 'up';
        })

        return status;
      })
    );
  }

  getAppStatus(services?: SystemService[]): Observable<boolean> {
    return this.http.get<any[]>(SystemStatusService.STATUS_ENDPOINT).pipe(
      map((statusDetails: any[]): boolean => {
        for (const statusDetail of statusDetails) {
          if ((!services || services.includes(statusDetail.slug)) && statusDetail.status !== 'up') {
            return false;
          }
        }

        return true;
      })
    );
  }
}
