import { Component, Input } from '@angular/core';
import { Path, ProjectMetadata } from '@biosimulations/datamodel-simulation-runs';
import { MatDialog } from '@angular/material/dialog';
import { MetadataDialogComponent } from '../metadata-dialog/metadata-dialog.component';

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

  @Input()
  usesMetadata = false;

  constructor(private dialog: MatDialog) {}

  openMetadata(metadata: ProjectMetadata): void {
    this.dialog.open(MetadataDialogComponent, {
      width: 'min(calc(1400px - 4rem), calc(100vw - 1.5rem))',
      data: metadata,
    });
  }

  isTextOverflowed(text: string): boolean {
    const element = document.createElement('span');
    element.style.visibility = 'hidden';
    element.style.position = 'fixed';
    element.style.whiteSpace = 'nowrap';
    element.style.pointerEvents = 'none';
    element.textContent = text;
    document.body.appendChild(element);
    const isOverflowed = element.offsetWidth < element.scrollWidth;
    document.body.removeChild(element);
    return isOverflowed;
  }
}
