import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AccessLevel } from '@biosimulations/datamodel/core';
import { getLicenseInfo } from '../../Shared/Models/license';
import { Model } from '../../Shared/Models/model';
import { RemoteFile } from '../../Shared/Models/remote-file';
import { ActivatedRoute, Router } from '@angular/router';
import { NavItemDisplayLevel } from '../../Shared/Enums/nav-item-display-level';
import { NavItem } from '../../Shared/Enums/nav-item';
import { BreadCrumbsService } from '../../Shared/Services/bread-crumbs.service';
import { ModelService } from '../../Shared/Services/Resources/model.service';
import { FormatTimeForHumansPipe } from '../../Shared/Pipes/format-time-for-humans.pipe';
import {
  OkCancelDialogComponent,
  OkCancelDialogData,
} from '../../Shared/Components/ok-cancel-dialog/ok-cancel-dialog.component';
import { UserSerializer, User } from '../../Shared/Models/user';
import { map } from 'rxjs/operators';
import { Person } from '../../Shared/Models/person';
import { UserService } from '../../Shared/Services/user.service';
import { SimulationService } from '../../Shared/Services/Resources/simulation.service';
import { VisualizationService } from '../../Shared/Services/Resources/visualization.service';
import { ChartTypeService } from '../../Shared/Services/Resources/chart-type.service';
import { Observable } from 'rxjs';
import { Simulation } from '../../Shared/Models/simulation';
import { Visualization } from '../../Shared/Models/visualization';
import { ChartType } from '../../Shared/Models/chart-type';
import { Project } from '../../Shared/Models/project';
import { ProjectService } from '../../Shared/Services/Resources/project.service';

@Component({
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.sass'],
})
export class ViewComponent implements OnInit {
  getLicenseInfo = getLicenseInfo;

  id: string;
  model: Model;
  owner: User;
  simulations: Observable<Simulation[]>;
  visualizations: Observable<Visualization[]>;
  chartTypes: Observable<ChartType[]>;
  projects: Observable<Project[]>;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(BreadCrumbsService) private breadCrumbsService: BreadCrumbsService,
    private modelService: ModelService,
    private userService: UserService,
    private simulationService: SimulationService,
    private visualizationService: VisualizationService,
    private chartTypeService: ChartTypeService,
    private projectService: ProjectService,
  ) {}

  ngOnInit() {
    // TODO handle these observables properly. Nested subscriptions are not ideal
    this.route.params.subscribe(routeParams => {
      this.id = routeParams.id;

      this.getData().subscribe(model => {
        this.model = model;
        this.model.userservice = this.userService;
        this.model.simulationService = this.simulationService;
        this.model.visualizationService = this.visualizationService;
        this.model.chartTypeService = this.chartTypeService;
        this.model.projectService = this.projectService;
        this.simulations = this.model.getSimulations();
        this.visualizations = this.model.getVisualizations();
        this.chartTypes = this.model.getChartTypes();
        this.projects = this.model.getProjects();

        console.warn(this.model);
        this.model.getOwner().subscribe(owner => {
          this.owner = owner;
          const crumbs: object[] = [
            { label: 'Models', route: '/models' },
            { label: 'Model ' + this.id },
          ];
          const buttons: NavItem[] = [
            {
              iconType: 'mat',
              icon: 'timeline',
              label: 'Simulate',
              route: ['/simulations', 'new', this.id],
              display: NavItemDisplayLevel.always,
            },
            {
              iconType: 'fas',
              icon: 'pencil-alt',
              label: 'Edit',
              route: ['/models', this.id, 'edit'],
              display:
                this.model && this.model.access === AccessLevel.public
                  ? NavItemDisplayLevel.never
                  : NavItemDisplayLevel.user,
              displayUser: !!this.model ? this.owner : null,
            },
            {
              iconType: 'fas',
              icon: 'trash-alt',
              label: 'Delete',
              click: () => {
                this.openDeleteDialog();
              },
              display:
                this.model && this.model.access === AccessLevel.public
                  ? NavItemDisplayLevel.never
                  : NavItemDisplayLevel.user,
              displayUser: !!this.model ? this.owner : null,
            },
            {
              iconType: 'fas',
              icon: 'plus',
              label: 'New',
              route: ['/models', 'new'],
              display: NavItemDisplayLevel.always,
            },
            {
              iconType: 'fas',
              icon: 'user',
              label: 'Your models',
              route: ['/user', 'models'],
              display: NavItemDisplayLevel.loggedIn,
            },
            {
              iconType: 'fas',
              icon: 'list',
              label: 'Browse',
              route: ['/models'],
              display: NavItemDisplayLevel.always,
            },
          ];
          this.breadCrumbsService.set(crumbs, buttons, ['tabs']);
        });
      });
    });
  }

  getData() {
    const model = this.modelService.read(this.id);
    return model;
  }

  download(): void {
    const url = (this.model.file as RemoteFile).url;
    const link = document.createElement('a');
    link.download = `model-${this.id}.xml`;
    link.href = url;
    link.click();
  }

  openDeleteDialog(): void {
    this.dialog.open(OkCancelDialogComponent, {
      data: {
        title: `Delete model ${this.id}?`,
        action: () => {
          this.modelService.delete(this.id);
          this.router.navigate(['/models']);
        },
      },
    });
  }
}
