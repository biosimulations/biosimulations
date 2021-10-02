import { Component, ChangeDetectionStrategy, Input, ViewChild } from '@angular/core';
import { Visualization } from '../view/view.model';
import { CombineArchive } from '@biosimulations/datamodel/common';
import { ProjectVegaVisualizationComponent } from '../project-vega-visualization/project-vega-visualization.component';

@Component({
  selector: 'biosimulations-project-visualization',
  templateUrl: './project-visualization.component.html',
  styleUrls: ['./project-visualization.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectVisualizationComponent {
  @Input()
  visualization!: Visualization;

  @ViewChild(ProjectVegaVisualizationComponent)
  private vegaComponent!: ProjectVegaVisualizationComponent;

  constructor() {}

  public render(): void {
    /*
    if (this.plotlyVisualization) {
      this.plotlyVisualization.setLayout();
    }    
    */
  }
}
