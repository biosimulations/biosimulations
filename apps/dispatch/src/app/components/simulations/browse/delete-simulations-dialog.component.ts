import { Component, Inject } from '@angular/core';
import {
  MatLegacyDialogRef as MatDialogRef,
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
} from '@angular/material/legacy-dialog';
import { BrowseComponent } from './browse.component';
import { Simulation } from '../../../datamodel';

@Component({
  templateUrl: 'delete-simulations-dialog.component.html',
  styleUrls: ['./delete-simulations-dialog.component.scss'],
})
export class DeleteSimulationsDialogComponent {
  public constructor(
    private dialogRef: MatDialogRef<BrowseComponent>,
    @Inject(MAT_DIALOG_DATA) public simulation: Simulation | undefined,
  ) {}
}
