import { Component, OnInit, Inject } from '@angular/core';
import { Visualization } from 'src/app/Shared/Models/visualization';
import { VisualizationSchema } from 'src/app/Shared/Models/visualization-schema';
import { VisualizationService } from 'src/app/Shared/Services/visualization.service';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { NavItemDisplayLevel } from 'src/app/Shared/Enums/nav-item-display-level';
import { NavItem } from 'src/app/Shared/Models/nav-item';
import { BreadCrumbsService } from 'src/app/Shared/Services/bread-crumbs.service';

@Component({
  selector: 'app-visualize',
  templateUrl: './visualize.component.html',
  styleUrls: ['./visualize.component.sass'],
})
export class VisualizeComponent implements OnInit {
  visualization: Visualization;
  id: string;

  constructor(
    private visService: VisualizationService,
    private route: ActivatedRoute,
    @Inject(BreadCrumbsService) private breadCrumbsService: BreadCrumbsService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(routeParams => {
      this.id = routeParams.id;

      const crumbs: object[] = [{label: 'Visualizations'}];
      const buttons: NavItem[] = [];

      if (this.id) {
        this.getVis();

        crumbs[0]['route'] = '/visualizations';
        crumbs.push({label: 'Visualization ' + this.id});
        buttons.push({
          iconType: 'fas',
          icon: 'list',
          label: 'Browse',
          route: ['/visualizations'],
          display: NavItemDisplayLevel.always,
        });
      }

      this.breadCrumbsService.set(crumbs, buttons);
    });
  }

  getVis() {
    this.visService
      .getVisualization(this.id)
      .subscribe((res: object[]) => {
        this.visualization = new Visualization();
        Object.assign(this.visualization, res[0]);
        this.visualization.schema = new VisualizationSchema();
        this.visualization.schema.spec = res[0]['spec'];
      });
  }
}
