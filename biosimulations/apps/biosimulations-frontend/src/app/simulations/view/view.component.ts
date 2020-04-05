import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { getLicenseInfo } from '../../Shared/Models/license';
import { Simulation } from '../../Shared/Models/simulation';
import { SimulationResultsFormat } from '@biosimulations/datamodel/core';
import { Observable } from 'rxjs';

import { Project } from '../../Shared/Models/project';
import { Visualization } from '../../Shared/Models/visualization';
import { ChartType } from '../../Shared/Models/chart-type';
import { User } from '../../Shared/Models/user';
import { ParameterChange } from '../../Shared/Models/parameter-change';
import { Router, ActivatedRoute } from '@angular/router';
import { BreadCrumbsService } from '../../Shared/Services/bread-crumbs.service';
import { SimulationService } from '../../Shared/Services/Resources/simulation.service';
import { UserService } from '../../Shared/Services/user.service';
import { ProjectService } from '../../Shared/Services/Resources/project.service';
import { ModelService } from '../../Shared/Services/Resources/model.service';
import { VisualizationService } from '../../Shared/Services/Resources/visualization.service';
import { ChartTypeService } from '../../Shared/Services/Resources/chart-type.service';
import { shareReplay } from 'rxjs/operators';
import { NavItem } from '../../Shared/Enums/nav-item';
import { NavItemDisplayLevel } from '../../Shared/Enums/nav-item-display-level';
import { AccessLevel } from '@biosimulations/datamodel/core';
import { OkCancelDialogComponent } from '../../Shared/Components/ok-cancel-dialog/ok-cancel-dialog.component';
import { Model } from '../../Shared/Models/model';

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
  projects: Observable<Project[]>;
  visualizations: Observable<Visualization[]>;
  chartTypes: Observable<ChartType[]>;
  model: Observable<Model>;
  owner: Observable<User>;
  parameterChanges: ParameterChange[];

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private breadCrumbsService: BreadCrumbsService,
    private simulationService: SimulationService,
    private userService: UserService,
    private projectService: ProjectService,
    private modelService: ModelService,
    private visualizationService: VisualizationService,
    private chartTypeService: ChartTypeService,
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
            true,
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
          this.model = this.modelService
            .read(this.simulation.MODEL)
            .pipe(shareReplay(1));
          this.owner = this.userService
            .get$(this.simulation.ownerId)
            .pipe(shareReplay(1));
          this.parameterChanges = this.simulation.modelParameterChanges.concat(
            this.simulation.algorithmParameterChanges,
          );

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
