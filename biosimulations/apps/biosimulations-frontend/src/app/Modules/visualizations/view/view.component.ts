import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AccessLevel } from '@biosimulations/datamodel/core';
import { getLicenseInfo } from 'src/app/Shared/Enums/license';
import { ChartType } from 'src/app/Shared/Models/chart-type';
import { Visualization } from 'src/app/Shared/Models/visualization';
import { VisualizationService } from 'src/app/Shared/Services/Resources/visualization.service';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { NavItemDisplayLevel } from 'src/app/Shared/Enums/nav-item-display-level';
import { NavItem } from 'src/app/Shared/Models/nav-item';
import { BreadCrumbsService } from 'src/app/Shared/Services/bread-crumbs.service';
import { VegaViewerComponent } from 'src/app/Shared/Components/vega-viewer/vega-viewer.component';
import {
  OkCancelDialogComponent,
  OkCancelDialogData,
} from 'src/app/Shared/Components/ok-cancel-dialog/ok-cancel-dialog.component';
import { Model } from 'src/app/Shared/Models/model';
import { ModelService } from 'src/app/Shared/Services/Resources/model.service';
import { ProjectService } from 'src/app/Shared/Services/Resources/project.service';
import { ChartTypeService } from 'src/app/Shared/Services/Resources/chart-type.service';
import { UserService } from 'src/app/Shared/Services/user.service';
import { SimulationService } from 'src/app/Shared/Services/Resources/simulation.service';
import { shareReplay } from 'rxjs/operators';
import { Simulation } from 'src/app/Shared/Models/simulation';
import { Project } from 'src/app/Shared/Models/project';
import { User } from 'src/app/Shared/Models/user';

@Component({
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.sass'],
})
export class ViewComponent implements OnInit {
  getLicenseInfo = getLicenseInfo;
  public readonly vegaOptions: object = {
    renderer: 'canvas',
  };

  id: string;
  visualization: Visualization;
  visualization$: Observable<Visualization>;
  vegaSpec: object;
  vegaData: object;

  @ViewChild('vegaViewer') vegaViewer: VegaViewerComponent;

  historyTreeNodes: object[];
  models: Observable<Model[]>;
  simulations: Observable<Simulation[]>;
  chartTypes: Observable<ChartType[]>;
  projects: Observable<Project[]>;
  owner: User;
  owner$: Observable<User>;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(BreadCrumbsService) private breadCrumbsService: BreadCrumbsService,
    private userService: UserService,
    private simulationService: SimulationService,
    private visualizationService: VisualizationService,
    private chartTypeService: ChartTypeService,
    private projectService: ProjectService,
    private modelService: ModelService,
  ) {}

  ngOnInit() {
    this.route.params.subscribe(routeParams => {
      this.id = routeParams.id;
      this.visualization$ = this.visualizationService
        .read(this.id)
        .pipe(shareReplay(1));
      this.visualization$.subscribe(vis => {
        this.visualization = vis;
        this.visualization.userService = this.userService;
        this.visualization.modelService = this.modelService;
        this.visualization.chartTypeService = this.chartTypeService;
        this.visualization.simulationService = this.simulationService;
        this.visualization.projectService = this.projectService;
        this.simulations = this.visualization.getSimulations();
        this.projects = this.visualization.getProjects();
        this.models = this.visualization.getModels();
        this.chartTypes = this.visualization.getChartTypes();
        // Todo get the vega spec
        // this.vegaSpec = this.visualization.getSpec();
        this.vegaData = {};
        this.historyTreeNodes = this.visualizationService.getHistory(
          this.id,
          true,
          true,
        );
        this.visualization.getOwner().subscribe(owner => {
          this.owner = owner;
        });
      });
    });
  }

  setUp(): void {
    const crumbs: object[] = [
      { label: 'Visualizations', route: '/visualizations' },
      { label: 'Visualization ' + this.id },
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
        route: ['/visualizations', this.id, 'fork'],
        display: NavItemDisplayLevel.always,
      },
      {
        iconType: 'fas',
        icon: 'pencil-alt',
        label: 'Edit',
        route: ['/visualizations', this.id, 'edit'],
        display:
          this.visualization && this.visualization.access === AccessLevel.public
            ? NavItemDisplayLevel.never
            : NavItemDisplayLevel.user,
        displayUser: !!this.visualization ? this.owner : null,
      },
      {
        iconType: 'fas',
        icon: 'trash-alt',
        label: 'Delete',
        click: () => {
          this.openDeleteDialog();
        },
        display:
          this.visualization && this.visualization.access === AccessLevel.public
            ? NavItemDisplayLevel.never
            : NavItemDisplayLevel.user,
        displayUser: !!this.visualization ? this.owner : null,
      },
      {
        iconType: 'fas',
        icon: 'plus',
        label: 'New',
        route: ['/visualizations', 'new'],
        display: NavItemDisplayLevel.always,
      },
      {
        iconType: 'fas',
        icon: 'user',
        label: 'Your visualizations',
        route: ['/user', 'visualizations'],
        display: NavItemDisplayLevel.loggedIn,
      },
      {
        iconType: 'fas',
        icon: 'list',
        label: 'Browse',
        route: ['/visualizations'],
        display: NavItemDisplayLevel.always,
      },
    ];
    this.breadCrumbsService.set(crumbs, buttons, ['tabs']);
  }

  download(format: string): void {
    if (format === 'png' || format === 'svg') {
      // TODO: get this working after vega viewer is working
      this.vegaViewer.viewApi.view.toImageURL(format).then(url => {
        const link = document.createElement('a');
        link.href = url;
        link.download = 'visualization-${ this.id }.${ format }';
        link.click();
      });
    } else {
      const link = document.createElement('a');
      const blob: Blob = new Blob([JSON.stringify(this.vegaSpec)], {
        type: 'application/json',
      });
      link.href = URL.createObjectURL(blob);
      link.download = 'visualization-${ this.id }.${ format }';
      link.click();
    }
  }

  openDeleteDialog(): void {
    this.dialog.open(OkCancelDialogComponent, {
      data: {
        title: `Delete visualization ${this.id}?`,
        action: () => {
          this.visualizationService.delete(this.id);
          this.router.navigate(['/visualizations']);
        },
      },
    });
  }
}
