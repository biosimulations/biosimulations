import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface OkCancelDialogData {
  title: string;
  action: () => void;
}

@Component({
  selector: 'app-ok-cancel-dialog',
  templateUrl: 'ok-cancel-dialog.component.html',
  styleUrls: ['ok-cancel-dialog.component.sass'],
})
export class OkCancelDialogComponent {

  constructor(
    private dialogRef: MatDialogRef<OkCancelDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OkCancelDialogData) {}

  doAction(): void {
    this.data.action();
    this.dialogRef.close();
  }
}
