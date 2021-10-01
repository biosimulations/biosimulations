import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { List } from '../view/view.model';

@Component({
  selector: 'biosimulations-project-simulation',
  templateUrl: './project-simulation.component.html',
  styleUrls: ['./project-simulation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectSimulationComponent {
  @Input()
  simulationRun!: List[];

  constructor() {}
}
