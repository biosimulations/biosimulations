import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { AlertService } from 'src/app/Services/alert.service';
import { SimulationService } from 'src/app/Services/simulation.service';

@Component({
  selector: 'app-past-simulation',
  templateUrl: './past-simulation.component.html',
  styleUrls: ['./past-simulation.component.sass'],
})
export class PastSimulationComponent implements OnInit {
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

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private alertService: AlertService,
    private simulationService: SimulationService,
    ) {}

  ngOnInit() {
    this.simulationService.simulationDataChangeSubject.subscribe(
      success => {
        this.simulationData = this.simulationService.simulationData;
        this.dataSource = new MatTableDataSource(this.simulationData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error => {
        this.alertService.openDialog(
          'Error in simulation service subject: ' +
          JSON.stringify(error)
          );
      }
    );
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
