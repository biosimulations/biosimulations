import { Component, Input } from '@angular/core';
import { FormattedSimulation } from '../view.model';
import { SharedSimulationService } from '@biosimulations/shared/services';
import { SimulationService } from '../../../../services/simulation/simulation.service';

@Component({
  selector: 'biosimulations-simulation-run-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent {
  @Input()
  public simulation!: FormattedSimulation;

  public constructor(
    private sharedSimulationService: SharedSimulationService,
    private platformSimulationService: SimulationService,
  ) {
    /* Constructor is empty */
  }

  public rerunProject(id: string): void {
    this.sharedSimulationService.rerunProject(id);
  }

  public rerunCustomProject(id: string): void {
    this.sharedSimulationService.rerunCustomProject(id);
  }

  public _rerunProject(id: string): void {
    this.platformSimulationService.rerunProject(id);
  }
}
