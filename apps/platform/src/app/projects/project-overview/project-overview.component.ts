/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import {
  Component,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
import { ProjectMetadata, List } from '../datamodel';

@Component({
  selector: 'biosimulations-project-overview',
  templateUrl: './project-overview.component.html',
  styleUrls: ['./project-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectOverviewComponent {
  @Input()
  public projectMetadata?: ProjectMetadata;

  @Input()
  public simulationRun?: List[];

  constructor() {}
}
