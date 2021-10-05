import { Component, Input } from '@angular/core';
import { FormattedSimulation } from '../view.model';

@Component({
  selector: 'biosimulations-simulation-run-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent {
  @Input()
  simulation!: FormattedSimulation;

  constructor() {}
}
