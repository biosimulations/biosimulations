import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { VisualisationService } from '../../../services/visualisation/visualisation.service';

@Component({
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent implements OnInit {
  uuid = '';

  sedmls!: Array<string>;
  reports!: Array<string>;

  formGroup: FormGroup;

  sedmlError!: string;
  reportError!: string;

  projectResults!: any;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private visualisationService: VisualisationService
  ) {
    this.formGroup = formBuilder.group({
      sedml: ['', [Validators.required]],
      report: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.uuid = this.route.snapshot.params['uuid'];
    this.setProjectResults({
      'file-1': {
        'report-1': {
          'a': {
            x: [1, 2, 3],
            y: [1, 2, 3]
          },
          'b': {
            x: [1, 2, 3],
            y: [4, 5, 6]
          },
        },
        'report-2': {
          'c': {
            x: [1, 2, 3],
            y: [1, 2, 3]
          },
          'd': {
            x: [1, 2, 3],
            y: [4, 5, 6]
          }, 
        }
      }
    });
    return;

    if (this.projectResults === undefined) {
      this.visualisationService
        .getVisualisation(this.uuid)
        .subscribe((data: any) => {
          this.setProjectResults(data['data']);
        });
    }
  }

  setProjectResults(projectResults: any): void {
    this.projectResults = projectResults;

    this.sedmls = Object.keys(projectResults);
    const sedml = this.sedmls[0];
    this.formGroup.controls.sedml.setValue(sedml);

    this.setSedml();
  }

  setSedml(): void {
    const sedml = this.formGroup.value.sedml;
    this.reports = Object.keys(this.projectResults[sedml]);
    const report = this.reports[0];
    this.formGroup.controls.report.setValue(report);
    this.setReport();
  }

  setReport(): void {
    const sedml = this.formGroup.value.sedml;
    const report = this.formGroup.value.report;
    const reportResults = this.projectResults[sedml][report];
    this.visualisationService.updateDataEvent.next({
      report: report,
      data: reportResults,
    });
  }
}
