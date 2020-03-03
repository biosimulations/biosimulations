import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AccessLevel } from 'src/app/Shared/Enums/access-level';
import { getLicenseInfo } from 'src/app/Shared/Enums/license';
import { Project } from 'src/app/Shared/Models/project';
import { ActivatedRoute, Router } from '@angular/router';
import { NavItemDisplayLevel } from 'src/app/Shared/Enums/nav-item-display-level';
import { NavItem } from 'src/app/Shared/Models/nav-item';
import { BreadCrumbsService } from 'src/app/Shared/Services/bread-crumbs.service';
import { ProjectService } from 'src/app/Shared/Services/Resources/project.service';
import { FormatTimeForHumansPipe } from 'src/app/Shared/Pipes/format-time-for-humans.pipe';
import {
  OkCancelDialogComponent,
  OkCancelDialogData,
} from 'src/app/Shared/Components/ok-cancel-dialog/ok-cancel-dialog.component';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/Shared/Services/user.service';
import { User } from 'src/app/Shared/Models/user';
import { ModelService } from 'src/app/Shared/Services/Resources/model.service';
import { Model } from 'src/app/Shared/Models/model';
import { SimulationService } from 'src/app/Shared/Services/Resources/simulation.service';
import { ChartTypeService } from 'src/app/Shared/Services/Resources/chart-type.service';
import { VisualizationService } from 'src/app/Shared/Services/Resources/visualization.service';

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
  project$: Observable<Project>;
  owner: Observable<User>;
  project: Project;
  resources: Observable<Model>[] = [];

  constructor(
    private modelService: ModelService,
    private simulationService: SimulationService,
    private chartTypeService: ChartTypeService,
    private visualizationService: VisualizationService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(BreadCrumbsService) private breadCrumbsService: BreadCrumbsService,
    private projectService: ProjectService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(routeParams => {
      this.id = routeParams.id;

      this.project$ = this.projectService.read(this.id);

      this.project$.subscribe(project => {
        project.products.forEach(product => {
          product.resourceIds.forEach(resourcePair => {
            const resourceId = resourcePair.resourceId;
            const resourceType = resourcePair.resourceType;

            if (resourceType === 'model') {
              product.resources.push(this.modelService.read(resourceId));
            } else if (resourceType === 'simulation') {
              product.resources.push(this.simulationService.read(resourceId));
            } else if (resourceType === 'chartType') {
              product.resources.push(this.chartTypeService.read(resourceId));
            } else if (resourceType === 'visualization') {
              product.resources.push(
                this.visualizationService.read(resourceId)
              );
            }
          });
        });

        this.project = project;

        this.owner = this.userService.get$(project.ownerId);

        const crumbs: object[] = [
          { label: 'Projects', route: '/projects' },
          { label: 'Project ' + this.id },
        ];
        const buttons: NavItem[] = [
          {
            iconType: 'fas',
            icon: 'pencil-alt',
            label: 'Edit',
            route: ['/projects', this.id, 'edit'],
            display:
              project && project.access === AccessLevel.public
                ? NavItemDisplayLevel.never
                : NavItemDisplayLevel.user,
            displayUser: !!project ? project.owner : null,
          },
          {
            iconType: 'fas',
            icon: 'trash-alt',
            label: 'Delete',
            click: () => {
              this.openDeleteDialog();
            },
            display:
              project && project.access === AccessLevel.public
                ? NavItemDisplayLevel.never
                : NavItemDisplayLevel.user,
            displayUser: !!project ? project.owner : null,
          },
          {
            iconType: 'fas',
            icon: 'plus',
            label: 'New',
            route: ['/projects', 'new'],
            display: NavItemDisplayLevel.always,
          },
          {
            iconType: 'fas',
            icon: 'user',
            label: 'Your projects',
            route: ['/user', 'projects'],
            display: NavItemDisplayLevel.loggedIn,
          },
          {
            iconType: 'fas',
            icon: 'list',
            label: 'Browse',
            route: ['/projects'],
            display: NavItemDisplayLevel.always,
          },
        ];
        this.breadCrumbsService.set(crumbs, buttons, ['tabs']);
      });
    });
  }

  getData() {}

  openDeleteDialog(): void {
    this.dialog.open(OkCancelDialogComponent, {
      data: {
        title: `Delete project ${this.id}?`,
        action: () => {
          this.projectService.delete(this.id);
          this.router.navigate(['/projects']);
        },
      },
    });
  }
}
