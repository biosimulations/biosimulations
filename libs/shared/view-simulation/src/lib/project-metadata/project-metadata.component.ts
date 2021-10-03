/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import {
  Component,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
import { ProjectMetadata, SimulationRunMetadata } from '@biosimulations/datamodel/view-simulation';

@Component({
  selector: 'biosimulations-project-metadata',
  templateUrl: './project-metadata.component.html',
  styleUrls: ['./project-metadata.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectMetadataComponent {
  @Input()
  public project?: ProjectMetadata;

  @Input()
  public simulationRun?: SimulationRunMetadata;

  constructor() {}
}
