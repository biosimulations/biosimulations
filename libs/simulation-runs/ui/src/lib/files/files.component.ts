import { Component, Input } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Path, ProjectMetadata } from '@biosimulations/datamodel-simulation-runs';
import { MatDialog } from '@angular/material/dialog';
import { MetadataDialogComponent } from '../metadata-dialog/metadata-dialog.component';

@Component({
  selector: 'biosimulations-project-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss'],
  animations: [
    trigger('hover', [
      state(
        'default',
        style({
          transform: 'scale(1)',
          'box-shadow': 'none',
        }),
      ),
      state(
        'hovered',
        style({
          transform: 'scale(1.1)',
          'box-shadow': '3px 3px 5px rgba(0,0,0,0.3)',
        }),
      ),
      transition('default <=> hovered', animate('200ms')),
    ]),
  ],
})
export class FilesComponent {
  @Input()
  files!: Path[];

  @Input()
  usesMaster = false;

  @Input()
  usesMetadata = false;

  @Input()
  useMetadata = false;

  cardState = 'default';

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
    element.style.pointerEvents = 'none';
    element.textContent = text;
    document.body.appendChild(element);
    const isOverflowed = element.offsetWidth < element.scrollWidth;
    document.body.removeChild(element);
    return isOverflowed;
  }
}
