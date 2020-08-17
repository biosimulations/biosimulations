import { Component, OnInit } from '@angular/core';
import { VisualisationService } from './services/visualisation/visualisation.service';
import { DispatchService } from './services/dispatch/dispatch.service';

@Component({
  selector: 'biosimulations-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit{
  // uuids: Array<string> = [];
  uuids: Array<string> = [];
  title = 'biosimulations-dispatch-frontend';

  constructor(private dispatchService: DispatchService) {
  }

  ngOnInit() {
    this.dispatchService.uuidUpdateEvent.subscribe(
      (uuid: string) => {
        const splitId = uuid.split('-');
        const idLast = splitId[splitId.length - 1];
        const substringId = idLast.substring(idLast.length - 5, idLast.length)
        this.uuids.push(substringId);
      },
      (error) => {
        console.log('Error occured while fetching UUIds: ', error);
      }
    );
  }
}
