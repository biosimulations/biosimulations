import { Component, Input } from '@angular/core';
import { Visualization } from '@biosimulations/datamodel-simulation-runs';

@Component({
  selector: 'biosimulations-project-visualization',
  templateUrl: './render-viz.component.html',
  styleUrls: ['./render-viz.component.scss'],
})
export class RenderVisualizationComponent {
  @Input()
  plotTitle!: any;

  @Input()
  projectTitle!: any;

  @Input()
  visualization!: Visualization;

  public constructor() {}
}
