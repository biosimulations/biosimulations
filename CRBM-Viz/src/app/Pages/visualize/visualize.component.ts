import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Visualization } from 'src/app/Models/visualization';
import { VisualizationsService } from 'src/app/Services/visualizations.service';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
@Component({
  selector: 'app-visualize',
  templateUrl: './visualize.component.html',
  styleUrls: ['./visualize.component.sass'],
})
export class VisualizeComponent implements OnInit {
  isBrowser = isPlatformBrowser(this.platformId);
  visualizations: Visualization[] = [];
  id: string;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
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
}
