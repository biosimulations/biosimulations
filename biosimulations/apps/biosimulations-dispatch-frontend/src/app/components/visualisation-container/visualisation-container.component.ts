import { Component, OnInit, Input } from '@angular/core';
import { VisualisationService } from '../../services/visualisation/visualisation.service';
import { ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'biosimulations-visualisation-container',
  templateUrl: './visualisation-container.component.html',
  styleUrls: ['./visualisation-container.component.scss']
})
export class VisualisationContainerComponent implements OnInit {

  @Input()
  graphData!: any;

  plots!: {task: string, data: any};
  


  constructor(
    private visualisationService: VisualisationService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // TODO: Decide view-vis layout per chart/task and inject into plots
    // this.plots = {
    //   data: this.graphData, // test
    //   task: 'task1'
    // };
  
    this.visualisationService.updateDataEvent.subscribe(
      (graphData: any) => {
        this.plots = {
          data: [graphData], // test
          task: 'task1'
        };

        console.log('Data from vis-container: ', graphData);
      },
      (error) => {

      }
    );

  }

}
