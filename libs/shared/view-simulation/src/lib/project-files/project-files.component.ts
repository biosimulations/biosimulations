import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Path } from '@biosimulations/datamodel/view-simulation';

@Component({
  selector: 'biosimulations-project-files',
  templateUrl: './project-files.component.html',
  styleUrls: ['./project-files.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectFilesComponent {
  @Input()
  files!: Path[];

  @Input()
  usesMaster = false;

  constructor() {}
}
