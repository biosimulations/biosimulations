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
import { OkCancelDialogComponent, OkCancelDialogData } from 'src/app/Shared/Components/ok-cancel-dialog/ok-cancel-dialog.component';

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

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(BreadCrumbsService) private breadCrumbsService: BreadCrumbsService,
    private simulationService: SimulationService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(routeParams => {
      this.id = routeParams.id;
      if (this.id) {
        this.getData();
      }

      const crumbs: object[] = [
        {label: 'Simulations', route: '/simulations'},
        {label: 'Simulation ' + this.id},
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
          display: (
            this.simulation
            && this.simulation.access === AccessLevel.public
            ? NavItemDisplayLevel.never
            : NavItemDisplayLevel.user),
          displayUser: (!!this.simulation ? this.simulation.owner : null),
        },
        {
          iconType: 'fas',
          icon: 'trash-alt',
          label: 'Delete',
          click: () => { this.openDeleteDialog() },
          display: (
            this.simulation
            && this.simulation.access === AccessLevel.public
            ? NavItemDisplayLevel.never
            : NavItemDisplayLevel.user),
          displayUser: (!!this.simulation ? this.simulation.owner : null),
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

  getData() {
    this.simulation = this.simulationService.get(this.id);
    this.historyTreeNodes = this.simulationService.getHistory(this.id, true, true);
  }

  openDeleteDialog(): void {
    this.dialog.open(OkCancelDialogComponent, {
      data: {
        title: `Delete simulation ${ this.id }?`,
        action: () => {
          this.simulationService.delete(this.id);
          this.router.navigate(['/simulations']);
        },
      },
    });
  }
}
