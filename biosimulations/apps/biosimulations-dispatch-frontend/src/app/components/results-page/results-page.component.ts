import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VisualisationService } from '../../services/visualisation/visualisation.service';

@Component({
  selector: 'biosimulations-results-page',
  templateUrl: './results-page.component.html',
  styleUrls: ['./results-page.component.scss']
})
export class ResultsPageComponent implements OnInit {

  uuid!: string;
  tasksPerSedml!: any;
  constructor(private route: ActivatedRoute, private visualisationService: VisualisationService) { }

  ngOnInit(): void {
    this.uuid = '213123123';
    this.uuid = this.route.snapshot.params['uuid'];
    // this.uuid = this.route.params['uuid'];

    this.visualisationService.uuidUpdateEvent.subscribe(
      (data) => {
        this.tasksPerSedml = this.visualisationService.tasksPerSedml;
      },
      (error => {

      })
    );
  }


}
