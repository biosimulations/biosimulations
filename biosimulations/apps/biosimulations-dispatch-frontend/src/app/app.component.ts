import { Component, OnInit } from '@angular/core';
import { VisualisationService } from './services/visualisation/visualisation.service';

@Component({
  selector: 'biosimulations-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit{
  uuids!: Array<string>;
  title = 'biosimulations-dispatch-frontend';

  constructor(private visualisationService: VisualisationService) {
  }

  ngOnInit() {
    this.uuids = ['sadasda'];
    this.visualisationService.uuidUpdateEvent.subscribe(
      (data: Array<string>) => {
        this.uuids = data;
      },
      (error) => {
        console.log('Error occured while fetching UUIds: ', error);
      }
    );
  }
}
