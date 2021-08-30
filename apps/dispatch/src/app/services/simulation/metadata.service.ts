import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SimulationRunMetadata } from '@biosimulations/datamodel/api';
import { Endpoints } from '@biosimulations/config/common';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class MetadataService {
  public constructor(private http: HttpClient) {}
  public getMetadata(simulationId: string): Observable<SimulationRunMetadata> {
    return this.http.get<SimulationRunMetadata>(
      `${Endpoints.simulationRunMetadata}/${simulationId}`,
    );
  }
}
