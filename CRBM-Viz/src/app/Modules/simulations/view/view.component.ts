import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { getLicenseInfo } from 'src/app/Shared/Enums/license';
import { Simulation } from 'src/app/Shared/Models/simulation';
import { ActivatedRoute, Router } from '@angular/router';
import { AccessLevel } from 'src/app/Shared/Enums/access-level';
import { NavItemDisplayLevel } from 'src/app/Shared/Enums/nav-item-display-level';
import { NavItem } from 'src/app/Shared/Models/nav-item';
import { SimulationResultsFormat } from 'src/app/Shared/Enums/simulation-results-format';
import { BreadCrumbsService } from 'src/app/Shared/Services/bread-crumbs.service';
import { SimulationService } from 'src/app/Shared/Services/simulation.service';
import { FormatTimeForHumansPipe } from 'src/app/Shared/Pipes/format-time-for-humans.pipe';
import {
  OkCancelDialogComponent,
  OkCancelDialogData,
} from 'src/app/Shared/Components/ok-cancel-dialog/ok-cancel-dialog.component';
import { UserService } from 'src/app/Shared/Services/user.service';
import { ProjectService } from 'src/app/Shared/Services/project.service';
import { ModelService } from 'src/app/Shared/Services/model.service';
import { VisualizationService } from 'src/app/Shared/Services/visualization.service';
import { ChartTypeService } from 'src/app/Shared/Services/chart-type.service';
import { Observable } from 'rxjs';
import { Model } from 'src/app/Shared/Models/model';

@Component({
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.sass'],
})
export class ViewComponent implements OnInit {
  getLicenseInfo = getLicenseInfo;

  id: string;
  simulation: Simulation;
  historyTreeNodes: object[];
  SimulationResultsFormat = SimulationResultsFormat;
  models: Observable<Model[]>;
  projects: Observable<
    import('/home/bilal/Projects/CRBM-Viz/CRBM-Viz/src/app/Shared/Models/project').Project[]
  >;
  visualizations: Observable<
    import('/home/bilal/Projects/CRBM-Viz/CRBM-Viz/src/app/Shared/Models/visualization').Visualization[]
  >;
  chartTypes: Observable<
    import('/home/bilal/Projects/CRBM-Viz/CRBM-Viz/src/app/Shared/Models/chart-type').ChartType[]
  >;
  model: Observable<Model>;
  owner: Observable<
    import('/home/bilal/Projects/CRBM-Viz/CRBM-Viz/src/app/Shared/Models/user').User
  >;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(BreadCrumbsService) private breadCrumbsService: BreadCrumbsService,
    private simulationService: SimulationService,
    private userService: UserService,
    private projectService: ProjectService,
    private modelService: ModelService,
    private visualizationService: VisualizationService,
    private chartTypeService: ChartTypeService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(routeParams => {
      this.id = routeParams.id;
      if (this.id) {
        this.simulationService.read(this.id).subscribe(simulation => {
          this.simulation = simulation;
          this.historyTreeNodes = this.simulationService.getHistory(
            this.id,
            true,
            true
          );
          this.simulation.userService = this.userService;
          this.simulation.projectService = this.projectService;
          this.simulation.modelService = this.modelService;
          this.simulation.visualizationService = this.visualizationService;
          this.simulation.chartTypeService = this.chartTypeService;
          this.models = simulation.getModels();
          this.projects = simulation.getProjects();
          this.visualizations = simulation.getVisualizations();
          this.chartTypes = simulation.getChartTypes();
          this.model = this.modelService.read(this.simulation.MODEL);
          this.owner = this.userService.get$(this.simulation.OWNER);
        });
      }

      const crumbs: object[] = [
        { label: 'Simulations', route: '/simulations' },
        { label: 'Simulation ' + this.id },
      ];
      const buttons: NavItem[] = [
        {
          iconType: 'fas',
          icon: 'paint-brush',
          label: 'Visualize',
          route: ['/visualizations', this.id],
          display: NavItemDisplayLevel.always,
        },
        {
          iconType: 'fas',
          icon: 'code-branch',
          label: 'Fork',
          route: ['/simulations', this.id, 'fork'],
          display: NavItemDisplayLevel.always,
        },
        {
          iconType: 'fas',
          icon: 'pencil-alt',
          label: 'Edit',
          route: ['/simulations', this.id, 'edit'],
          display:
            this.simulation && this.simulation.access === AccessLevel.public
              ? NavItemDisplayLevel.never
              : NavItemDisplayLevel.user,
          displayUser: !!this.simulation ? this.simulation.owner : null,
        },
        {
          iconType: 'fas',
          icon: 'trash-alt',
          label: 'Delete',
          click: () => {
            this.openDeleteDialog();
          },
          display:
            this.simulation && this.simulation.access === AccessLevel.public
              ? NavItemDisplayLevel.never
              : NavItemDisplayLevel.user,
          displayUser: !!this.simulation ? this.simulation.owner : null,
        },
        {
          iconType: 'fas',
          icon: 'plus',
          label: 'New',
          route: ['/simulations', 'new'],
          display: NavItemDisplayLevel.always,
        },
        {
          iconType: 'fas',
          icon: 'user',
          label: 'Your simulations',
          route: ['/user', 'simulations'],
          display: NavItemDisplayLevel.loggedIn,
        },
        {
          iconType: 'fas',
          icon: 'list',
          label: 'Browse',
          route: ['/simulations'],
          display: NavItemDisplayLevel.always,
        },
      ];
      this.breadCrumbsService.set(crumbs, buttons, ['tabs']);
    });
  }

  getData() {}

  openDeleteDialog(): void {
    this.dialog.open(OkCancelDialogComponent, {
      data: {
        title: `Delete simulation ${this.id}?`,
        action: () => {
          this.simulationService.delete(this.id);
          this.router.navigate(['/simulations']);
        },
      },
    });
  }
}
