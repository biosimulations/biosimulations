import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AccessLevel } from '@biosimulations/datamodel/core';
import { getLicenseInfo } from '../../../Shared/Models/license';
import { ChartType } from '../../../Shared/Models/chart-type';
import { Observable } from 'rxjs';
import { Simulation } from '../../../Shared/Models/simulation';
import { Visualization } from '../../../Shared/Models/visualization';

import { Project } from '../../../Shared/Models/project';
import { User } from '../../../Shared/Models/user';
import { Router, ActivatedRoute } from '@angular/router';
import { BreadCrumbsService } from '../../../Shared/Services/bread-crumbs.service';
import { ChartTypeService } from '../../../Shared/Services/Resources/chart-type.service';
import { SimulationService } from '../../../Shared/Services/Resources/simulation.service';
import { ModelService } from '../../../Shared/Services/Resources/model.service';
import { ProjectService } from '../../../Shared/Services/Resources/project.service';
import { UserService } from '../../../Shared/Services/user.service';
import { VisualizationService } from '../../../Shared/Services/Resources/visualization.service';
import { shareReplay } from 'rxjs/operators';
import { NavItem } from '../../../Shared/Enums/nav-item';
import { NavItemDisplayLevel } from '../../../Shared/Enums/nav-item-display-level';
import { OkCancelDialogComponent } from '../../../Shared/Components/ok-cancel-dialog/ok-cancel-dialog.component';
import { Model } from '../../../Shared/Models/model';

@Component({
  templateUrl: './view.component.html',
  styleUrls: [
    '../../../Shared/Components/cards/cards.component.sass',
    './view.component.sass',
  ],
})
export class ViewComponent implements OnInit {
  getLicenseInfo = getLicenseInfo;

  id: string;
  chartType: ChartType;
  chartType$: Observable<ChartType>;
  simulations: Observable<Simulation[]>;
  visualizations: Observable<Visualization[]>;
  models: Observable<Model[]>;
  projects: Observable<Project[]>;
  owner: User;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(BreadCrumbsService) private breadCrumbsService: BreadCrumbsService,
    private chartTypeService: ChartTypeService,
    private simulationService: SimulationService,
    private modelService: ModelService,
    private projectService: ProjectService,
    private userService: UserService,
    private visualizationService: VisualizationService,
  ) {}

  ngOnInit() {
    this.route.params.subscribe(routeParams => {
      this.id = routeParams.id;
      this.chartType$ = this.chartTypeService
        .read(this.id)
        .pipe(shareReplay(1));
      this.chartType$.subscribe(chart => {
        this.chartType = chart;
        this.chartType.simulationService = this.simulationService;
        this.chartType.modelService = this.modelService;
        this.chartType.projectService = this.projectService;
        this.chartType.visualizationService = this.visualizationService;
        this.chartType.userService = this.userService;
        this.simulations = this.chartType.getSimulations();
        this.models = this.chartType.getModels();
        this.visualizations = this.chartType.getVisualizations();
        this.projects = this.chartType.getProjects();
        this.chartType.getOwner().subscribe(owner => {
          this.owner = owner;
          this.setUp();
        });
      });
    });
  }
  setUp() {
    const crumbs: object[] = [
      { label: 'Chart types', route: '/chart-types' },
      { label: 'Chart type ' + this.id },
    ];
    const buttons: NavItem[] = [
      {
        iconType: 'fas',
        icon: 'pencil-alt',
        label: 'Edit',
        route: ['/chart-types', this.id, 'edit'],
        display:
          this.chartType && this.chartType.access === AccessLevel.public
            ? NavItemDisplayLevel.never
            : NavItemDisplayLevel.user,
        displayUser: !!this.chartType ? this.owner : null,
      },
      {
        iconType: 'fas',
        icon: 'trash-alt',
        label: 'Delete',
        click: () => {
          this.openDeleteDialog();
        },
        display:
          this.chartType && this.chartType.access === AccessLevel.public
            ? NavItemDisplayLevel.never
            : NavItemDisplayLevel.user,
        displayUser: !!this.chartType ? this.owner : null,
      },
      {
        iconType: 'fas',
        icon: 'plus',
        label: 'New',
        route: ['/chart-types', 'new'],
        display: NavItemDisplayLevel.always,
      },
      {
        iconType: 'fas',
        icon: 'user',
        label: 'Your chart types',
        route: ['/user', 'chart-types'],
        display: NavItemDisplayLevel.loggedIn,
      },
      {
        iconType: 'fas',
        icon: 'list',
        label: 'Browse',
        route: ['/chart-types'],
        display: NavItemDisplayLevel.always,
      },
    ];
    this.breadCrumbsService.set(crumbs, buttons, ['tabs']);
  }
  getData() {
    this.chartTypeService
      .read(this.id)
      .subscribe(chart => (this.chartType = chart));
  }

  download(): void {
    const link = document.createElement('a');
    link.download = `chart-type-${this.id}.json`;
    const blob: Blob = new Blob([JSON.stringify(this.chartType.spec)], {
      type: 'application/json',
    });
    link.href = URL.createObjectURL(blob);
    link.click();
  }

  openDeleteDialog(): void {
    this.dialog.open(OkCancelDialogComponent, {
      data: {
        title: `Delete chart type ${this.id}?`,
        action: () => {
          this.chartTypeService.delete(this.id);
          this.router.navigate(['/chart-types']);
        },
      },
    });
  }
}
