import { Injectable, Injector } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Subject, of, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { ResourceService } from './resource.service';
import { UserService } from '../user.service';
import { AlertService } from '../alert.service';
import { ModelSerializer } from '../../Serializers/model-serializer';
import { ModelVariable } from '../../Models/model-variable';
import { ModelParameter } from '../../Models/model-parameter';
import { environment } from '../../../../environments/environment.prod';
import { Model } from '../../Models/model';
import { PrimitiveType } from '@biosimulations/datamodel/core';

@Injectable({
  providedIn: 'root',
})
export class ModelService {
  constructor(private http: HttpClient, alertService: AlertService) {}
  read(id: string): Observable<Model> {
    return of(new Model());
  }
  list(): Observable<Model[]> {
    return of([new Model(), new Model()]);
  }

  // TODO extract actual variables from model
  getVariables(): ModelVariable[] {
    const variables: ModelVariable[] = [];
    for (let iVariable = 0; iVariable < 3; iVariable++) {
      const variable = new ModelVariable({
        id: `var-${iVariable + 1}`,
        target: 'null',
        group: 'null',
        type: PrimitiveType.string,
        units: 'null',
        name: `Variable ${iVariable + 1}`,
        description: 'null',
        identifiers: [],
      });
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
        (item) =>
          (id && item['id'].toLowerCase().includes(lowCaseId)) ||
          (name && item['name'].toLowerCase().includes(lowCaseName)),
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
      (success) => {
        this.alertService.openDialog(
          'File upload was successful: ' + JSON.stringify(success),
        );
        this.getFileData();
      },
      (error) => {
        this.alertService.openDialog(
          'File upload failed: ' + JSON.stringify(error),
        );
      },
    );
  }

  getFileData(): void {
    this.http.get(`${environment.crbm.CRBMAPI_URL}/file`).subscribe(
      (success) => {
        this.fileList = success['data'];
        this.fileChangeSubject.next();
      },
      (error) => {},
    );
  }

  deleteFile(fileId: number): void {
    this.http
      .delete(`${environment.crbm.CRBMAPI_URL}/file/${fileId}`)
      .subscribe(
        (success) => {
          this.alertService.openDialog(
            'File deleted successfully' + JSON.stringify(success),
          );
          this.getFileData();
          this.fileChangeSubject.next();
        },
        (error) => {
          this.alertService.openDialog(
            'There was an error while deleting the file' +
              JSON.stringify(error),
          );
        },
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
        (success) => {
          console.log('File update successfull', success);
          this.alertService.openDialog('File update successful');
          this.router.navigate(['/models']);
        },
        (error) => {
          console.log('File update failed', error);
          this.alertService.openDialog('File update failed');
        },
      );
  }
}
