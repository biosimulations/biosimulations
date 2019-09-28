import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CrbmConfig } from 'src/app/crbm-config';
import { CrbmAuthService } from 'src/app/Services/crbm-auth.service';
import { SocialUser } from 'angularx-social-login';
import { MatDialog } from '@angular/material';
import { AlertComponent } from 'src/app/Components/alert/alert.component';

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
  selectedValue: string = null;

  constructor(
    private http: HttpClient,
    private crbmAuthService: CrbmAuthService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  submit(): void {
    const isValid = this.validateForm();
    if (isValid) {
      this.uploadFile(this.fileToUpload, this.selectedValue)
      .subscribe(
        onSuccess => {
          this.openDialog(onSuccess['message']);
        },
        onFail => {
          console.log('File upload failed ', onFail);
        }
      );
    } else {
      this.openDialog('Either file extension is not allowed, or access Type not selected');
    }
  }

  validateForm() {
    let fileExtension = null;
    let isFileNull = null;
    try {
      const fileArray = this.fileToUpload.name.split('.');
      fileExtension = fileArray[fileArray.length - 1];
      isFileNull = false;
    } catch (err) {
      isFileNull = true;
    }

    if (isFileNull) {
      return false;
    } else if ( !isFileNull
        && CrbmConfig.ALLOWED_FILE_EXTENSIONS.includes(fileExtension)
       && this.selectedValue !== null) {
      return true;
    } else {
      return false;
    }
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

  openDialog(msg: string): void {
    const dialogRef = this.dialog.open(AlertComponent, {
      width: '250px',
      data: {message: msg}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
