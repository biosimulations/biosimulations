import { Component, Input } from '@angular/core';
import { Path } from '@biosimulations/datamodel-simulation-runs';

@Component({
  selector: 'biosimulations-project-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss'],
})
export class FilesComponent {
  @Input()
  files!: Path[];

  @Input()
  usesMaster = false;

  constructor() {}
}
