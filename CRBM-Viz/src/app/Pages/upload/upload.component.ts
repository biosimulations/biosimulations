import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CrbmConfig } from 'src/app/crbm-config';
import { AuthService } from 'src/app/Services/auth0.service';
import { MatDialog } from '@angular/material';
import { AlertComponent } from 'src/app/Components/alert/alert.component';
import { AlertService } from 'src/app/Services/alert.service';
import { FileService } from 'src/app/Services/file.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.sass'],
})
export class UploadComponent implements OnInit {
  fileToUpload: File = null;
  accessTypes = [
    { value: 'private', viewValue: 'Private' },
    { value: 'public', viewValue: 'Public' },
  ];
  selectedValue: string = null;

  constructor(
    private alertService: AlertService,
    private fileService: FileService
  ) {}

  ngOnInit() {
  }

  submit(): void {
    const isValid = this.validateForm();
    if (isValid) {
      this.fileService.uploadFile(this.fileToUpload, this.selectedValue);
    } else {
      this.alertService.openDialog(
        'Either file extension is not allowed, or access Type not selected'
      );
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
    } else if (
      !isFileNull &&
      CrbmConfig.ALLOWED_FILE_EXTENSIONS.includes(fileExtension) &&
      this.selectedValue !== null
    ) {
      return true;
    } else {
      return false;
    }
  }

  fileChange(files: FileList) {
    this.fileToUpload = files.item(0);
  }
}
