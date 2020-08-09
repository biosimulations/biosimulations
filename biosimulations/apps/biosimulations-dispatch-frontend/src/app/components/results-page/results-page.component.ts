import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VisualisationService } from '../../services/visualisation/visualisation.service';

@Component({
  selector: 'biosimulations-results-page',
  templateUrl: './results-page.component.html',
  styleUrls: ['./results-page.component.scss']
})
export class ResultsPageComponent implements OnInit {

  uuid: string = '';
  tasksPerSedml!: any;
  graphData!: any;

  // TODO: Add dropdown for all sedmls
  sedmlSelected!: string;
  constructor(private route: ActivatedRoute, private visualisationService: VisualisationService) { }

  ngOnInit(): void {
    this.uuid = 'abcd123';
    // this.uuid = this.route.snapshot.params['uuid'];
    // this.uuid = this.route.params['uuid'];

    if(this.graphData === undefined) {
      this.visualisationService.getVisualisation(this.uuid).subscribe(
        (data: any) => {
          console.log(data)
          // TODO: Remove this after testing
          this.sedmlSelected = Object.keys(data['data'])[0]; // TEST
          this.graphData = data['data'][this.sedmlSelected]['task1']['IR']; //test
          
          console.log(this.graphData);
          // TODO: Save data somewhere, bind to the vis-container only the selected data
          // this.graphData = data['data'];
          

        }
      )
    }

  }


}
