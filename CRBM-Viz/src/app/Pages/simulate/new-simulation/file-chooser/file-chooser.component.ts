import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { FileService } from 'src/app/Shared/Services/file.service';
import { AuthService } from 'src/app/Shared/Services/auth0.service';
import { AlertService } from 'src/app/Shared/Services/alert.service';
import { SelectionModel } from '@angular/cdk/collections';
import { SimulationService } from 'src/app/Shared/Services/simulation.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-file-chooser',
  templateUrl: './file-chooser.component.html',
  styleUrls: ['./file-chooser.component.sass']
})
export class FileChooserComponent implements OnInit {
  selection = new SelectionModel<object>(false, null, true);
  selectedFile = null;

  isLoading = false;
  serverUrl = environment.crbm.CRBMAPI_URL; // Required in template
  fileList: Array<object> = null;
  displayedColumns: string[] = [
    // 'fileId',
    'filename',
    'createdBy',
    // 'accessType',
  ];
  dataSource: MatTableDataSource<object>;
  currentUser = null;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private fileService: FileService,
    private auth: AuthService,
    private alertService: AlertService,
    private simulationService: SimulationService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

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
    this.fileService.getFileData({ extension: 'omex'});

    this.auth.userProfile$.subscribe(
      profile => this.currentUser = profile
    );

    this.selection.onChange.subscribe((a) =>
    {
        if (a.added[0])   // will be undefined if no selection
        {
          this.selectedFile = a.added[0];
        }
    });
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

  onClickNext() {
    this.simulationService.parseCombineArchive(this.selectedFile);
    this.router.navigate(['tasks'], {relativeTo: this.route});
  }
}
