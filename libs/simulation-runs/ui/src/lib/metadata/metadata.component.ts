/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import {
  ProjectMetadata,
  SimulationRunMetadata,
} from '@biosimulations/datamodel-view';

@Component({
  selector: 'biosimulations-project-metadata',
  templateUrl: './metadata.component.html',
  styleUrls: ['./metadata.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetadataComponent {
  @Input()
  public project?: ProjectMetadata;

  @Input()
  public simulationRun?: SimulationRunMetadata;

  constructor() {}
}
