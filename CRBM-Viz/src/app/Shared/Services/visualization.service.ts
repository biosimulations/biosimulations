import { Injectable } from '@angular/core';
import { Visualization } from 'src/app/Shared/Models/visualization';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VisualizationService {
  constructor(private http: HttpClient) {}
  vizUrl = 'https://crbm-test-api.herokuapp.com/vis/';

  static _get(id: number, includeRelObj = false): Visualization {
    const viz: Visualization = new Visualization();
    viz.id = id;
    viz.name = 'Viz-' + id.toString();
    return viz;
  }

  get(id: number): Visualization {
    return VisualizationService._get(id, true);
  }

  getVisualizations(id: string): Observable<Visualization[]> {
    const vizJson = this.http.get<Visualization[]>(this.vizUrl + id);
    return vizJson;
  }
}
