import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { List } from '../datamodel';

@Component({
  selector: 'biosimulations-project-simulation',
  templateUrl: './project-simulation.component.html',
  styleUrls: ['./project-simulation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectSimulationComponent {
  @Input()
  simulationInfo!: List[];

  constructor() {}
}
