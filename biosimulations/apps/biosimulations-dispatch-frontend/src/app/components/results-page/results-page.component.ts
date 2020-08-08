import { Component, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

@Component({
  selector: 'biosimulations-results-page',
  templateUrl: './results-page.component.html',
  styleUrls: ['./results-page.component.scss']
})
export class ResultsPageComponent implements OnInit {

  uuid!: string;
  constructor() { }

  ngOnInit(): void {
    this.uuid = '213123123';
    // this.uuid = this.route.params['uuid'];
  }

}
