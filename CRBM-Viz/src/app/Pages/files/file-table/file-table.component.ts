import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/Services/auth0.service';
import { AlertService } from 'src/app/Services/alert.service';
import { FileService } from 'src/app/Services/file.service';
import * as config from '../../../../../../config.json'

@Component({
  selector: 'app-file-table',
  templateUrl: './file-table.component.html',
  styleUrls: ['./file-table.component.sass'],
})
export class FileTableComponent implements OnInit {
  isLoading = true;
  serverUrl = config.crbm.CRBMAPI_URL; // Required in template
  fileList: Array<object> = null;
  displayedColumns: string[] = [
    'fileId',
    'filename',
    'createdBy',
    'accessType',
  ];
  dataSource: MatTableDataSource<object>;
  currentUser = null;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private http: HttpClient, 
    private fileService: FileService,
    private auth: AuthService,
    private alertService: AlertService) { }

  ngOnInit() {
    this.fileService.fileChangeSubject.subscribe(
      success => {
        this.fileList = this.fileService.fileList;
        this.dataSource = new MatTableDataSource(this.fileList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
      },
      error => {
        this.alertService.openDialog(
          'Error from FileTableComponent, can\'t fetch files: '+
          JSON.stringify(error)
        );
      }
    );

    this.fileService.getFileData();

    this.auth.userProfile$.subscribe(
      profile => this.currentUser = profile
    );
  }

  

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onFileDelete(fileId: number) {
    this.fileService.deleteFile(fileId);
  }
}
