import { Component, OnInit, Inject } from '@angular/core';
import { getLicenseInfo } from 'src/app/Shared/Enums/license';
import { Simulation } from 'src/app/Shared/Models/simulation';
import { ActivatedRoute, Router } from '@angular/router';
import { NavItemDisplayLevel } from 'src/app/Shared/Enums/nav-item-display-level';
import { NavItem } from 'src/app/Shared/Models/nav-item';
import { SimulationResultsFormat } from 'src/app/Shared/Enums/simulation-results-format';
import { BreadCrumbsService } from 'src/app/Shared/Services/bread-crumbs.service';
import { SimulationService } from 'src/app/Shared/Services/simulation.service';
import { FormatTimeForHumansPipe } from 'src/app/Shared/Pipes/format-time-for-humans.pipe';

@Component({
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.sass'],
})
export class ViewComponent implements OnInit {
  getLicenseInfo = getLicenseInfo;

  id: string;
  simulation: Simulation;
  simulationHistoryTreeNodes: object[];
  SimulationResultsFormat = SimulationResultsFormat;

  constructor(
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
    });

    const crumbs: object[] = [
      {label: 'Simulations', route: '/simulations'},
      {label: 'Simulation ' + this.id},
    ];
    const buttons: NavItem[] = [
      {
        iconType: 'fas',
        icon: 'list',
        label: 'Browse',
        route: ['/simulations'],
        display: NavItemDisplayLevel.always,
      },
      {
        iconType: 'fas',
        icon: 'plus',
        label: 'New',
        route: ['/simulations/new'],
        display: NavItemDisplayLevel.always,
      },
      {
        iconType: 'fas',
        icon: 'user',
        label: 'Your simulations',
        route: ['/user/simulations'],
        display: NavItemDisplayLevel.loggedIn,
      },
    ];
    this.breadCrumbsService.set(crumbs, buttons, ['tabs']);
  }

  getData() {
    this.simulation = this.simulationService.get(this.id);
    this.simulationHistoryTreeNodes = this.simulationService.getHistory(this.id, true, true);
  }

  edit(): void {
    this.router.navigate(['/simulations', 'new', this.id]);
  }

  visualize(): void {
    this.router.navigate(['/visualizations', this.id]);
  }
}
