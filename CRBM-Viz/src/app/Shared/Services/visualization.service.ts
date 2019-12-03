import { Injectable, Injector } from '@angular/core';
import { AccessLevel } from '../Enums/access-level';
import { Visualization } from 'src/app/Shared/Models/visualization';
import { AuthService } from 'src/app/Shared/Services/auth0.service';
import { UserService } from 'src/app/Shared/Services/user.service';
import { ModelService } from 'src/app/Shared/Services/model.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VisualizationService {
  private userService: UserService;
  private modelService: ModelService;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private injector:Injector) {}
  vizUrl = 'https://crbm-test-api.herokuapp.com/vis/';

  static _get(id: number, includeRelObj = false): Visualization {
    const viz: Visualization = new Visualization();
    viz.id = id;
    viz.name = 'Viz-' + id.toString();
    return viz;
  }

  private getServices(): void {
    if (this.userService == null) {
      this.userService = this.injector.get(UserService);
      this.modelService = this.injector.get(ModelService);
    }
  }

  get(id: number): Visualization {
    return VisualizationService._get(id, true);
  }

  getVisualizations(id: string): Observable<Visualization[]> {
    const vizJson = this.http.get<Visualization[]>(this.vizUrl + id);
    return vizJson;
  }

  save(id: number, visualization:Visualization): number {
    visualization.owner = this.userService.get();
    visualization.created = new Date(Date.now());
    visualization.updated = new Date(Date.now());
    visualization.id = 7;

    return visualization.id;
  }
}
