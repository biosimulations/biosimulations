import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AccessLevel } from 'src/app/Shared/Enums/access-level';
import { getLicenseInfo } from 'src/app/Shared/Enums/license';
import { Project } from 'src/app/Shared/Models/project';
import { ActivatedRoute, Router } from '@angular/router';
import { NavItemDisplayLevel } from 'src/app/Shared/Enums/nav-item-display-level';
import { NavItem } from 'src/app/Shared/Models/nav-item';
import { BreadCrumbsService } from 'src/app/Shared/Services/bread-crumbs.service';
import { ProjectService } from 'src/app/Shared/Services/project.service';
import { FormatTimeForHumansPipe } from 'src/app/Shared/Pipes/format-time-for-humans.pipe';
import {
  OkCancelDialogComponent,
  OkCancelDialogData,
} from 'src/app/Shared/Components/ok-cancel-dialog/ok-cancel-dialog.component';

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
  project: Project;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(BreadCrumbsService) private breadCrumbsService: BreadCrumbsService,
    private projectService: ProjectService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(routeParams => {
      this.id = routeParams.id;

      this.getData();

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
            this.project && this.project.access === AccessLevel.public
              ? NavItemDisplayLevel.never
              : NavItemDisplayLevel.user,
          displayUser: !!this.project ? this.project.owner : null,
        },
        {
          iconType: 'fas',
          icon: 'trash-alt',
          label: 'Delete',
          click: () => {
            this.openDeleteDialog();
          },
          display:
            this.project && this.project.access === AccessLevel.public
              ? NavItemDisplayLevel.never
              : NavItemDisplayLevel.user,
          displayUser: !!this.project ? this.project.owner : null,
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
  }

  getData() {
    this.projectService
      .read(this.id)
      .subscribe(project => (this.project = project));
  }

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
