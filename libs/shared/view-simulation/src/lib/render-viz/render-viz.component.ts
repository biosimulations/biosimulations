import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Visualization } from '@biosimulations/datamodel/view-simulation';

@Component({
  selector: 'biosimulations-project-visualization',
  templateUrl: './render-viz.component.html',
  styleUrls: ['./render-viz.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RenderVisualizationComponent {
  @Input()
  visualization!: Visualization;

  constructor() {}
}
