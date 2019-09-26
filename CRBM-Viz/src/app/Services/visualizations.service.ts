import { Injectable } from '@angular/core';
import { Visualization } from 'src/app/Models/visualization';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class VisualizationsService {
  constructor(private http: HttpClient) {}
  vizUrl = 'https://crbm-test-api.herokuapp.com/vis/3';

  getVisualizations(): Observable<Visualization[]> {
    let vizJson = this.http.get<Visualization[]>(this.vizUrl);
    return vizJson;
  }
}
