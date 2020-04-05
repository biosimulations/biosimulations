import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResourceService } from './resource.service';
import { Project } from '../../Models/project';
import { UserService } from '../user.service';
import { ProjectSerializer } from '../../Serializers/project-serializer';
@Injectable({
  providedIn: 'root',
})
export class ProjectService extends ResourceService<Project> {
  private userService: UserService;

  constructor(private http: HttpClient, private injector: Injector) {
    super(http, 'projects', new ProjectSerializer());
  }

  private filter(list: object[], id?: string, name?: string): object[] {
    let lowCaseId: string;
    let lowCaseName: string;
    if (id) {
      lowCaseId = id.toLowerCase();
    }
    if (name) {
      lowCaseName = name.toLowerCase();
    }

    if (id || name) {
      return list.filter(
        item =>
          id === undefined ||
          item['id'].toLowerCase().includes(lowCaseId) ||
          name === undefined ||
          item['name'].toLowerCase().includes(lowCaseName),
      );
    } else {
      return list;
    }
  }
}
