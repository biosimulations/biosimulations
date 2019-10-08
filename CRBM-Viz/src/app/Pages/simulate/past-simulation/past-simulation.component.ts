import { Component, OnInit, ViewChild } from '@angular/core';
import { SocialUser } from 'angularx-social-login';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { CrbmConfig } from 'src/app/crbm-config';
import { AlertService } from 'src/app/Services/alert.service';

@Component({
  selector: 'app-past-simulation',
  templateUrl: './past-simulation.component.html',
  styleUrls: ['./past-simulation.component.sass']
})
export class PastSimulationComponent implements OnInit {

  serverUrl = CrbmConfig.CRBMAPI_URL;
  displayedColumns: string[] = [
    'job_id',
    'created_by',
    'created_date',
    'error',
    'output',
    'sbatch_file',
    'sbatch_file_owner',
    'solver_file',
    'omex_file',
  ];
  dataSource: MatTableDataSource<object>;
  simulationData = null;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    private http: HttpClient,
    private alertService: AlertService) {
    
  }

  ngOnInit() {
    this.getFileInfo()
      .subscribe(
        success => {
          console.log('Fetching of Omex and solver successful', success);
          this.simulationData = this.flattenSimulationData(success['data']['simulations']);
          this.dataSource = new MatTableDataSource(this.simulationData);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error => {
          this.alertService.openDialog('Error occured while fetching file info');
        }
      );
  }

  flattenSimulationData(simData) {
    const data = [];
    for (const sim of simData) {
      const simObj = {...sim};
      const jobInfo = sim['jobInfo'];
      for (const key in jobInfo) {
        if (jobInfo.hasOwnProperty(key)) {
          simObj[key] = jobInfo[key];
        }
      }
      data.push(simObj);
    }
    return data;
  }

  getFileInfo() {
    return this.http.get(`${CrbmConfig.CRBMAPI_URL}/simulation`);
  }


  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
