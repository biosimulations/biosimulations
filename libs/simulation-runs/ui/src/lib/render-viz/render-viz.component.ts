import { Component, Input } from '@angular/core';
import { Visualization } from '@biosimulations/datamodel-simulation-runs';

@Component({
  selector: 'biosimulations-project-visualization',
  templateUrl: './render-viz.component.html',
  styleUrls: ['./render-viz.component.scss'],
})
export class RenderVisualizationComponent {
  @Input() public plotTitle!: string;
  @Input() public projectTitle!: string;
  @Input() public visualization!: Visualization;
  @Input() public name?: string;
  @Input() public customAxis?: boolean | any;

  public constructor() {
    /* constructor is empty */
  }
}
