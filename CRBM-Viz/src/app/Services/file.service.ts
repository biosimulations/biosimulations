import { Injectable } from '@angular/core';
import * as config from '../../../../config.json'
import { AlertService } from './alert.service.js';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  fileList: Array<object> = null;
  fileChangeSubject = new Subject<null>();

  constructor(
    private http: HttpClient,
    private alertService: AlertService
  ) { }

  uploadFile(file: File, accessType: string) {
    const endpoint = `${config.crbm.CRBMAPI_URL}/file`;
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('accessType', accessType);
    this.http.post(endpoint, formData).subscribe(
      success => {
        this.alertService.openDialog(
          'File upload was successful: ' + 
          JSON.stringify(success)
        );
        this.getFileData();
      },
      error => {
        this.alertService.openDialog(
          'File upload failed: ' +
          JSON.stringify(error)
        )
      }
    );
  }

  getFileData(): void {
    this.http.get(`${config.crbm.CRBMAPI_URL}/file`).subscribe(
      success => {
        this.fileList = success['data'];
        this.fileChangeSubject.next();
      },
      error => {

      }
    );
  }

  deleteFile(fileId: number): void {
    this.http.delete(`${config.crbm.CRBMAPI_URL}/file/${fileId}`).subscribe
    (
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
    )
  }
}
