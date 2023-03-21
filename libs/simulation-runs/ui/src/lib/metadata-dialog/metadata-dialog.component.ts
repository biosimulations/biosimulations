import { Component, Inject } from '@angular/core';
import {
  MatLegacyDialogRef as MatDialogRef,
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
} from '@angular/material/legacy-dialog';
import { FilesComponent } from '../files/files.component';
import { ProjectMetadata } from '@biosimulations/datamodel-simulation-runs';

@Component({
  templateUrl: 'metadata-dialog.component.html',
  styleUrls: ['./metadata-dialog.component.scss'],
})
export class MetadataDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<FilesComponent>,
    @Inject(MAT_DIALOG_DATA) public metadata: ProjectMetadata,
  ) {}
}
