import { Injectable, Injector } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Subject, of, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Format } from '../Models/format';
import { Model, ModelSerializer } from '../Models/model';
import { ModelParameter } from '../Models/model-parameter';
import { ModelVariable } from '../Models/model-variable';
import { AlertService } from './alert.service';
import { UserService } from './user.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ModelService {
  private userService: UserService;

  fileList: Array<object> = null;
  fileChangeSubject = new Subject<null>();

  constructor(
    private http: HttpClient,
    private alertService: AlertService,
    private router: Router,
    private injector: Injector
  ) {}
  private url = environment.crbm.CRBMAPI_URL;

  private getServices(): void {
    if (this.userService == null) {
      this.userService = this.injector.get(UserService);
    }
  }

  get(id: string): Observable<Model> {
    return this.http
      .get<any>(this.url + '/models/' + id)
      .pipe(map(modelJson => ModelSerializer.fromJson(modelJson)));
  }
  getAll$(): Observable<Model[]> {
    return this.http.get<object[]>(this.url + '/models').pipe(
      map((modelsJson: object[]) => {
        const models: Model[] = [];

        modelsJson.forEach(modelJson => {
          const testModel = ModelSerializer.fromJson(modelJson);
          models.push(testModel);
        });
        return models;
      })
    );
  }
  getVariables(model: Model): ModelVariable[] {
    const variables: ModelVariable[] = [];
    for (let iVariable = 0; iVariable < 3; iVariable++) {
      const variable = new ModelVariable();
      variable.id = `var-${iVariable + 1}`;
      variable.name = `Variable ${iVariable + 1}`;
      variables.push(variable);
    }
    return variables;
  }

  getParameters(model: Model, value?: string): ModelParameter[] {
    return this.filter(model.parameters, value, value) as ModelParameter[];
  }

  list(name?: string, owner?: string): Observable<Model[]> {
    // TODO: filter on name, owner attributes
    return this.http.get<object[]>(this.url + '/models').pipe(
      map((modelsJson: object[]) => {
        const models: Model[] = [];

        modelsJson.forEach(modelJson => {
          const testModel = ModelSerializer.fromJson(modelJson);
          models.push(testModel);
        });
        return models;
      })
    );
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
          (id && item['id'].toLowerCase().includes(lowCaseId)) ||
          (name && item['name'].toLowerCase().includes(lowCaseName))
      );
    } else {
      return list;
    }
  }

  set(data: Model, id?: string): string {
    this.getServices();

    if (!id) {
      id = '007';
    }

    data.id = id;
    data.format = new Format('SBML', 'L2V4', 2585, 'http://sbml.org');

    data.created = new Date(Date.now());
    data.updated = new Date(Date.now());

    return id;
  }

  delete(id?: string): void {}

  /////////////////////////////
  // Methods from FileService
  uploadFile(file: File, accessType: string) {
    const url = `${environment.crbm.CRBMAPI_URL}/file`;
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('accessType', accessType);
    this.http.post(url, formData).subscribe(
      success => {
        this.alertService.openDialog(
          'File upload was successful: ' + JSON.stringify(success)
        );
        this.getFileData();
      },
      error => {
        this.alertService.openDialog(
          'File upload failed: ' + JSON.stringify(error)
        );
      }
    );
  }

  getFileData(): void {
    this.http.get(`${environment.crbm.CRBMAPI_URL}/file`).subscribe(
      success => {
        this.fileList = success['data'];
        this.fileChangeSubject.next();
      },
      error => {}
    );
  }

  deleteFile(fileId: number): void {
    this.http
      .delete(`${environment.crbm.CRBMAPI_URL}/file/${fileId}`)
      .subscribe(
        success => {
          this.alertService.openDialog(
            'File deleted successfully' + JSON.stringify(success)
          );
          this.getFileData();
          this.fileChangeSubject.next();
        },
        error => {
          this.alertService.openDialog(
            'There was an error while deleting the file' + JSON.stringify(error)
          );
        }
      );
  }

  getFile(fileId: number) {
    return this.http.get(`${environment.crbm.CRBMAPI_URL}/file/${fileId}`);
  }

  saveFile(currentFile: object, selectedValue: string): void {
    this.http
      .put(`${environment.crbm.CRBMAPI_URL}/file/${currentFile['fileId']}`, {
        accessType: selectedValue,
      })
      .subscribe(
        success => {
          console.log('File update successfull', success);
          this.alertService.openDialog('File update successful');
          this.router.navigate(['/models']);
        },
        error => {
          console.log('File update failed', error);
          this.alertService.openDialog('File update failed');
        }
      );
  }
}
