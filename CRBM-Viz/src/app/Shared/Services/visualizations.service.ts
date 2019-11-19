import { Injectable } from '@angular/core';
import { Visualization } from 'src/app/Shared/Models/visualization';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VisualizationsService {
  constructor(private http: HttpClient) {}
  vizUrl = 'https://crbm-test-api.herokuapp.com/vis/';

  getVisualizations(id: string): Observable<Visualization[]> {
    const vizJson = this.http.get<Visualization[]>(this.vizUrl + id);
    return vizJson;
  }

  get(id: number): Visualization {
    return VisualizationsService._get(id);
  }

  static _get(id: number): Visualization {
    const viz: Visualization = new Visualization();
    viz.id = id;
    viz.name = 'Viz-' + id.toString();
    return viz;
  }
}
