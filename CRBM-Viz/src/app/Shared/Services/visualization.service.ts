import { Injectable, Injector } from '@angular/core';
import { AccessLevel } from '../Enums/access-level';
import { Visualization } from 'src/app/Shared/Models/visualization';
import { AuthService } from 'src/app/Shared/Services/auth0.service';
import { UserService } from 'src/app/Shared/Services/user.service';
import { ProjectService } from 'src/app/Shared/Services/project.service';
import { ModelService } from 'src/app/Shared/Services/model.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VisualizationService {
  private userService: UserService;
  private projectService: ProjectService;
  private modelService: ModelService;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private injector:Injector) {}
  vizUrl = 'https://crbm-test-api.herokuapp.com/vis/';

  static _get(id: number, includeRelatedObjects = false): Visualization {
    const viz: Visualization = new Visualization();
    viz.id = id;
    viz.name = 'Viz-' + id.toString();
    return viz;
  }

  private getServices(): void {
    if (this.userService == null) {
      this.userService = this.injector.get(UserService);
      this.projectService = this.injector.get(ProjectService);
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

  list(name?: string): Visualization[] {
    const data: Visualization[] = [
      this.get(1),
      this.get(2),
      this.get(3),
      this.get(6),
    ];
    return this.filter(data, name) as Visualization[];
  }

  private filter(list: object[], name?: string): object[] {
    if (name) {
      const lowCaseName: string = name.toLowerCase();
      return list.filter(item => item['name'].toLowerCase().includes(lowCaseName));
    } else {
      return list;
    }
  }

  set(data: Visualization, id?: number): number {
    if (!id) {
      id = 7;
    }

    data.id = id;
    data.owner = this.userService.get();
    data.created = new Date(Date.now());
    data.updated = new Date(Date.now());

    return id;
  }

  delete(id?: number): void {}
}
