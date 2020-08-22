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

  plots!: {data: any, layout: any};
  


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
        const res:any  = [];
        const keys = Object.keys(graphData['data']);
        keys.forEach(element => {
          res.push({...graphData['data'][element], name: element});
        });
        this.plots = {
            data: res,
            layout: {width: 1000, height: 800, title:graphData['task'] }
        };

        

        console.log('Data from vis-container: ', graphData['data']);
      },
      (error) => {

      }
    );

  }

}
