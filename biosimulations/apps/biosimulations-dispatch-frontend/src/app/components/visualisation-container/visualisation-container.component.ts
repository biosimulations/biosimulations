import { Component, OnInit, Input } from '@angular/core';
import { VisualisationService } from '../../services/visualisation/visualisation.service';
import { ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'biosimulations-visualisation-container',
  templateUrl: './visualisation-container.component.html',
  styleUrls: ['./visualisation-container.component.scss']
})
export class VisualisationContainerComponent implements OnInit {

  plots!: object;
  @Input()
  sedml!: string;

  constructor(
    private visualisationService: VisualisationService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.visualisationService.getVisualisation(this.route.snapshot.params['uuid']).subscribe(
      (data: any) => {
        console.log(Object.keys(data['data']))
      },
      (error) => {
        console.log('Error occured while fetching chart data:', error)
      }
    );
  }

}
