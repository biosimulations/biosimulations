import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VisualisationService } from '../../services/visualisation/visualisation.service';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'biosimulations-results-page',
  templateUrl: './results-page.component.html',
  styleUrls: ['./results-page.component.scss'],
})
export class ResultsPageComponent implements OnInit {
  uuid = '';
  tasksPerSedml!: any;
  graphData!: any;
  sedmls!: Array<string>;
  tasks!: Array<string>;
  // TODO: Add dropdown for all sedmls
  taskSelected!: string;
  sedmlSelected!: string;
  constructor(
    private route: ActivatedRoute,
    private visualisationService: VisualisationService,
  ) {}

  ngOnInit(): void {
    // this.uuid = 'abcd123';
    this.uuid = this.route.snapshot.params['uuid'];
    // this.uuid = this.route.params['uuid'];

    if (this.graphData === undefined) {
      this.visualisationService
        .getVisualisation(this.uuid)
        .subscribe((data: any) => {
          console.log(data);
          this.graphData = data['data'];
          // TODO: Remove this after testing
          this.sedmls = Object.keys(data['data']);
          this.sedmlSelected = this.sedmls[0];
          this.tasks = Object.keys(this.graphData[this.sedmlSelected]);
          this.taskSelected = this.tasks[0];

          const plotData = this.graphData[this.sedmlSelected][
            this.taskSelected
          ];

          // console.log(this.graphData);
          // TODO: Save data somewhere, bind to the vis-container only the selected data
          // this.graphData = data['data'];

          this.visualisationService.updateDataEvent.next({
            task: this.taskSelected,
            data: plotData,
          });
        });
    }
  }

  onSedmlChange($event: MatSelectChange) {
    this.tasks = Object.keys(this.graphData[$event.value]);
    this.taskSelected = this.tasks[0];

    const plotData = this.graphData[this.sedmlSelected][this.taskSelected];

    // console.log(this.graphData);
    // TODO: Save data somewhere, bind to the vis-container only the selected data
    // this.graphData = data['data'];

    this.visualisationService.updateDataEvent.next({
      task: this.taskSelected,
      data: plotData,
    });
  }
}
