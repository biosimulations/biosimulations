import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Download } from '../datamodel';

@Component({
  selector: 'biosimulations-project-downloads',
  templateUrl: './project-downloads.component.html',
  styleUrls: ['./project-downloads.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDownloadsComponent {
  @Input()
  downloads!: Download[];

  constructor() {}
}
