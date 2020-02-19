import { Injectable, Injector } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Subject, of, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Format } from 'src/app/Shared/Models/format';
import { Model } from 'src/app/Shared/Models/model';
import { ModelParameter } from 'src/app/Shared/Models/model-parameter';
import { ModelVariable } from 'src/app/Shared/Models/model-variable';
import { AlertService } from 'src/app/Shared/Services/alert.service';
import { UserService } from 'src/app/Shared/Services/user.service';
import { map } from 'rxjs/operators';
import { ResourceService } from 'src/app/Shared/Services/Resources/resource.service';
import { ModelSerializer } from 'src/app/Shared/Serializers/model-serializer';

@Injectable({
  providedIn: 'root',
})
export class ModelService extends ResourceService<Model> {
  private userService: UserService;

  fileList: Array<object> = null;
  fileChangeSubject = new Subject<null>();

  constructor(
    private http: HttpClient,
    private alertService: AlertService,
    private router: Router,
    private injector: Injector
  ) {
    super(http, 'models', new ModelSerializer());
  }

  // TODO extract actual variables from model
  getVariables(): ModelVariable[] {
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
