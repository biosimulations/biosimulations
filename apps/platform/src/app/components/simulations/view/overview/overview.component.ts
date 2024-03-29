import { Component, Input } from '@angular/core';
import { FormattedSimulation } from '../view.model';
import { SimulationService } from '../../../../services/simulation/simulation.service';

@Component({
  selector: 'biosimulations-simulation-run-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent {
  @Input()
  public simulation!: FormattedSimulation;

  public constructor(private simulationService: SimulationService) {
    /* Constructor is empty */
  }

  public rerunProject(id: string): void {
    this.simulationService.rerunProject(id);
  }
}
