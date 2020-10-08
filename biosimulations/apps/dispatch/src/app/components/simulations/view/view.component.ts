import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { SimulationService } from '../../../services/simulation/simulation.service';
import { VisualisationService } from '../../../services/visualisation/visualisation.service';
import { VisualisationComponent } from './visualisation/visualisation.component';
import { DispatchService } from '../../../services/dispatch/dispatch.service';

@Component({
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent implements OnInit {
  uuid = '';
  name = 'Knockout of gene A';
  status = 'finished';
  submitted = '2020-08-39 12:43:00';
  updated = '2020-08-30 10:05:12';
  runtime = '1 min';
  projectUrl = '';
  projectSize = '300 kb';
  resultsUrl = '';
  resultsSize = '5 mb';

  sedmls!: Array<string>;
  reports!: Array<string>;
  outLog = 'No output logs found'
  errLog = 'No error logs found'

  formGroup: FormGroup;

  sedmlError!: string;
  reportError!: string;

  projectStructure!: any;

  selectedSedml!: string;
  selectedReport!: string;

  @ViewChild('visualization') visualization!: VisualisationComponent;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private simulationService: SimulationService,
    private visualisationService: VisualisationService,
    private dispatchService: DispatchService
  ) {
    this.formGroup = formBuilder.group({
      sedml: ['', [Validators.required]],
      report: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.uuid = this.route.snapshot.params['uuid'];
    if (this.projectStructure === undefined) {
      this.visualisationService
        .getResultStructure(this.uuid)
        .subscribe((data: any) => {
          // data['data'].submittedLocally = false;
          this.setProjectResults(data['data']);
          // this.simulationService.storeSimulation(data['data']);
        });
    }

    this.dispatchService.getSimulationLogs(this.uuid)
      .subscribe((data: any) => {
        if (data.data === undefined) {
          this.outLog = data.message;
        } else {
          const out = data.data.output;
          const err = data.data.error;

          if (err !== "") {
            this.errLog = err;
          } else {
            this.outLog = out;
          }
        }
      })

  }

  setProjectResults(projectStructure: any): void {
    this.projectStructure = projectStructure;

    this.sedmls = Object.keys(projectStructure);
    this.selectedSedml = this.sedmls[0];
    // const sedml = this.sedmls[0];
    // this.formGroup.controls.sedml.setValue(sedml);

    this.setSedml();
  }

  setSedml(): void {
    // const sedml = this.formGroup.value.sedml;
    // this.reports = Object.keys(this.projectResults[sedml]);
    this.reports = this.projectStructure[this.selectedSedml];
    this.selectedReport = this.reports[0];
    // const report = this.reports[0];
    // this.formGroup.controls.report.setValue(report);
    this.setReport();
  }

  setReport(): void {
    // const sedml = this.formGroup.value.sedml;
    // const report = this.formGroup.value.report;
    // const reportResults = this.projectResults[sedml][report];

    this.visualisationService
      .getVisualisation(this.uuid, this.selectedSedml, this.selectedReport)
      .subscribe((data: any) => {
        this.visualisationService.updateDataEvent.next({
          report: this.selectedReport,
          data: data['data'],
        });
      });
  }

  selectedTabChange($event: MatTabChangeEvent): void {
    if ($event.index == 3) {
      this.visualization.setLayout();
    }
  }
}
