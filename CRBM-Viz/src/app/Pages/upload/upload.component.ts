import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CrbmConfig } from 'src/app/crbm-config';
import { CrbmAuthService } from 'src/app/Services/crbm-auth.service';
import { SocialUser } from 'angularx-social-login';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.sass']
})
export class UploadComponent implements OnInit {

  fileToUpload: File = null;
  accessTypes = [
    {value: 'private', viewValue: 'Private'},
    {value: 'public', viewValue: 'Public'},
  ];

  constructor(
    private http: HttpClient,
    private crbmAuthService: CrbmAuthService
  ) { }

  ngOnInit() {
  }

  submit() {
    this.uploadFile(this.fileToUpload, 'private')
    .subscribe(
      onSuccess => {
        console.log('File upload successful ', onSuccess);
      },
      onFail => {
        console.log('File upload failed ', onFail);
      }
    );
  }

  uploadFile(file: File, accessType: string) {
    const endpoint = `${CrbmConfig.CRBMAPI_URL}/file`;
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('accessType', accessType);
    return this.http.post(endpoint, formData);
  }

  fileChange(files: FileList) {
    this.fileToUpload = files.item(0);
  }

}
