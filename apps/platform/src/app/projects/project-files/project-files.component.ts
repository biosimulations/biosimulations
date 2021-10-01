import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Directory, File } from '../view/view.model';

@Component({
  selector: 'biosimulations-project-files',
  templateUrl: './project-files.component.html',
  styleUrls: ['./project-files.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectFilesComponent {
  @Input()
  files!: (Directory | File)[];

  @Input()
  usesMaster = false;

  constructor() {}
}
