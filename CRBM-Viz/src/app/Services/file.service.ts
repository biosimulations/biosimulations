import { Injectable } from '@angular/core';
import { environment }  from 'src/environments/environment';
import { AlertService } from './alert.service.js';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  fileList: Array<object> = null;
  fileChangeSubject = new Subject<null>();

  constructor(
    private http: HttpClient,
    private alertService: AlertService,
    private router: Router
  ) { }

  uploadFile(file: File, accessType: string) {
    const endpoint = `${environment.crbm.CRBMAPI_URL}/file`;
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

  getFileData(filters?: object): void {
    let filterString = ''
    if ( Object.keys(filters).length > 0) {
      filterString = '?'
      for (const key of Object.keys(filters)) {
        filterString = filterString + key + '=' + filters[key] + '&';
      }
      filterString = filterString.substr(0, filterString.length - 1);
    }
    console.log('filters: ', filterString);
    this.http.get(`${environment.crbm.CRBMAPI_URL}/file${filterString}`).subscribe(
      success => {
        this.fileList = success['data'];
        this.fileChangeSubject.next();
      },
      error => {

      }
    );
  }

  deleteFile(fileId: number): void {
    this.http.delete(`${environment.crbm.CRBMAPI_URL}/file/${fileId}`).subscribe
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

  getFile(fileId: number) {
    return this.http.get(`${environment.crbm.CRBMAPI_URL}/file/${fileId}`);
  }

  saveFile(currentFile: object, selectedValue: string): void {
    this.http.put(`${environment.crbm.CRBMAPI_URL}/file/${currentFile['fileId']}`, {
      accessType: selectedValue
    })
      .subscribe(
        success => {
            console.log('File update successfull', success);
            this.alertService.openDialog('File update successful');
            this.router.navigate(['/files']);

        },
        error => {
          console.log('File update failed', error);
          this.alertService.openDialog('File update failed');
        }
      );
  }
}
