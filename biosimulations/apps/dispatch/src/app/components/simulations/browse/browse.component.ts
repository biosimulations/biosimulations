import { Component, OnInit } from '@angular/core';
import { DispatchService } from '../../../services/dispatch/dispatch.service';

@Component({
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss'],
})
export class BrowseComponent implements OnInit {
  uuids: Array<string> = [];
  uuidsComplete: Array<string> = [];

  constructor(private dispatchService: DispatchService) {}

  ngOnInit() {
    this.dispatchService.uuidUpdateEvent.subscribe(
      (uuid: string) => {
        this.uuidsComplete.push(uuid);
        const splitId = uuid.split('-');
        const idLast = splitId[splitId.length - 1];
        const substringId = idLast.substring(idLast.length - 5, idLast.length);
        this.uuids.push(substringId);
      },
      (error) => {
        console.log('Error occured while fetching UUIds: ', error);
      },
    );
  }
}
