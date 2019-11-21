import { Component, OnInit, Inject } from '@angular/core';
import { Simulation } from 'src/app/Shared/Models/simulation';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadCrumbsService } from 'src/app/Shared/Services/bread-crumbs.service';
import { SimulationService } from 'src/app/Shared/Services/simulation.service';
import { FormatTimeForHumansPipe } from 'src/app/Shared/Pipes/format-time-for-humans.pipe';

@Component({
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.sass'],
})
export class ViewComponent implements OnInit {
  id: string;
  simulation: Simulation;
  simulationHistoryTreeNodes: object[];

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
      {label: 'Simulate', route: '/simulate'},
      {label: 'Simulation ' + this.id},
    ];
    const buttons: object[] = [
      {
        iconType: 'mat',
        icon: 'view_list',
        label: 'Browse',
        route: ['/simulate'],
        display: 'always',
      },
      {
        iconType: 'mat',
        icon: 'add',
        label: 'New',
        route: ['/simulate/new'],
        display: 'loggedIn',
      },
      {
        iconType: 'mat',
        icon: 'hourglass_empty',
        label: 'My simulations',
        route: ['/simulate/mine'],
        display: 'loggedIn',
      },
    ];
    this.breadCrumbsService.set(crumbs, buttons, ['tabs']);
  }

  getData() {
    this.simulation = this.simulationService.get(this.id);
    this.simulationHistoryTreeNodes = this.simulationService.getHistory(this.id, true, true);
  }

  edit(): void {
    this.router.navigate(['/simulate', 'new', this.id]);
  }

  visualize(): void {
    this.router.navigate(['/visualize', this.id]);
  }

  download(): void {
    const url = this.simulation.getFileUrl();
    const link = document.createElement('a');
    link.download = `simulation-${ this.id }.xml`;
    link.href = url;
    link.click();
  }
}
