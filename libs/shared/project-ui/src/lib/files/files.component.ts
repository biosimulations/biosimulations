import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Path } from '@biosimulations/datamodel/project';

@Component({
  selector: 'biosimulations-project-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilesComponent {
  @Input()
  files!: Path[];

  @Input()
  usesMaster = false;

  constructor() {}
}
