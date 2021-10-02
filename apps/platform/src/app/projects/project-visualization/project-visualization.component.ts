import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Visualization } from '../view/view.model';

@Component({
  selector: 'biosimulations-project-visualization',
  templateUrl: './project-visualization.component.html',
  styleUrls: ['./project-visualization.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectVisualizationComponent {
  @Input()
  visualization!: Visualization;

  constructor() {}
}
