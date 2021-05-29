import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowseComponent } from './browse.component';
import { Simulation } from '../../../datamodel';

@Component({
  templateUrl: 'delete-simulations-dialog.component.html',
  styleUrls: ['./delete-simulations-dialog.component.scss'],
})
export class DeleteSimulationsDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<BrowseComponent>,
    @Inject(MAT_DIALOG_DATA) public simulation: Simulation | undefined,
  ) {}
}
