/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import { Component, Input } from '@angular/core';
import {
  ProjectMetadata,
  SimulationRunMetadata,
} from '@biosimulations/datamodel-simulation-runs';

@Component({
  selector: 'biosimulations-project-metadata',
  templateUrl: './metadata.component.html',
  styleUrls: ['./metadata.component.scss'],
})
export class MetadataComponent {
  @Input()
  public project?: ProjectMetadata;

  @Input()
  public simulationRun?: SimulationRunMetadata;

  constructor() {}
}
