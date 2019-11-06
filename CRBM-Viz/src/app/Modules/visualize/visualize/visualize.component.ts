import { Component, OnInit } from '@angular/core';
import { Visualization } from 'src/app/Shared/Models/visualization';
import { VisualizationsService } from 'src/app/Shared/Services/visualizations.service';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-visualize',
  templateUrl: './visualize.component.html',
  styleUrls: ['./visualize.component.sass'],
})
export class VisualizeComponent implements OnInit {
  visualizations: Visualization[] = [];
  id: string;

  constructor(
    private visService: VisualizationsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe(routeParams => {
      this.id = routeParams.id;
      if (this.id) {
        this.getVis();
      }
    });
  }

  getVis() {
    this.visService
      .getVisualizations(this.id)
      .subscribe((res: Visualization[]) => {
        this.visualizations = res;
      });
  }
  getTimeChart() {}
}
