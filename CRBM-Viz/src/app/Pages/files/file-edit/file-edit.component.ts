import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { CrbmConfig } from 'src/app/crbm-config';
import { AlertService } from 'src/app/Services/alert.service';

@Component({
  selector: 'app-file-edit',
  templateUrl: './file-edit.component.html',
  styleUrls: ['./file-edit.component.sass']
})



export class FileEditComponent implements OnInit {

  accessTypes = [
    {value: 'private', viewValue: 'Private'},
    {value: 'public', viewValue: 'Public'},
  ];

  selectedValue = null;
  currentFile: object = null;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private alertService: AlertService) { }

  ngOnInit() {
    const fileId = this.route.snapshot.params['fileId'];
    this.getCurrentFile(fileId)
      .subscribe(
        success => {
          this.currentFile = success['data'];
          this.selectedValue = this.currentFile['accessType'];
        },
        error => {
          console.log('Error in fetching specific file', error);
        }
      );
  }

  getCurrentFile(fileId: number) {
    return this.http.get(`${CrbmConfig.CRBMAPI_URL}/file/${fileId}`);
  }

  onClickSave() {
    this.http.put(`${CrbmConfig.CRBMAPI_URL}/file/${this.currentFile['fileId']}`, {
      accessType: this.selectedValue
    })
      .subscribe(
        success => {
            console.log('File update successfull', success);
            this.alertService.openDialog('File update successful');
        },
        error => {
          console.log('File update failed', error);
          this.alertService.openDialog('File update failed');
        }
      );
  }

}
