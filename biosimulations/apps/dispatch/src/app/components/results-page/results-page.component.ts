import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { VisualisationService } from '../../services/visualisation/visualisation.service';

@Component({
  selector: 'biosimulations-results-page',
  templateUrl: './results-page.component.html',
  styleUrls: ['./results-page.component.scss'],
})
export class ResultsPageComponent implements OnInit {
  uuid!: string;

  sedmls!: Array<string>;
  tasks!: Array<string>;

  formGroup: FormGroup;

  sedmlError!: string;
  taskError!: string;

  projectStructure!: any;
  taskResults!: any;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private visualisationService: VisualisationService
  ) {
    this.formGroup = formBuilder.group({
      sedml: ['', [Validators.required]],
      task: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.uuid = this.route.snapshot.params['uuid'];
    // if (this.projectResults === undefined) {
    //   this.visualisationService
    //     .getVisualisation(this.uuid)
    //     .subscribe((data: any) => {
    //       this.setProjectResults(data['data']);
    //     });
    // }
    // TODO: Unsubscribe OnDestroy
    if (this.projectStructure === undefined) {
      this.visualisationService
        .getResultStructure(this.uuid)
        .subscribe((data: any) => {
          this.setProjectStructure(data['data']);
        });
    }
  }

  setProjectStructure(struct: any): void {
    this.projectStructure = struct;
    this.sedmls = Object.keys(struct);
    const sedml = this.sedmls[0];
    this.formGroup.controls.sedml.setValue(sedml);
    this.setSedml();
  }

  setSedml(): void {
    const sedml = this.formGroup.value.sedml;
    this.tasks = this.projectStructure[sedml];
    const task = this.tasks[0];
    this.formGroup.controls.task.setValue(task);
    this.setTask();
  }

  setTask(): void {
    const sedml = this.formGroup.value.sedml;
    const task = this.formGroup.value.task;
    this.visualisationService
      .getVisualisation(this.uuid, sedml, task)
      .subscribe((data: any) => {
        // Getting result for the actual sedml-task combo
        this.taskResults = data['data'];
        this.visualisationService.updateDataEvent.next({
          task: task,
          data: this.taskResults,
        });
      });
  }
}
