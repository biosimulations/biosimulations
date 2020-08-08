import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'apps/biosimulations-dispatch-frontend/src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VisualisationService {
  private resultsEndpoint = `${environment.crbm.DISPATCH_API_URL}/result`;
  constructor(private http: HttpClient) { }

  getVisualisation(uuid: string) {
    return this.http.get(`${this.resultsEndpoint}/${uuid}?chart=true`);
  }
}
