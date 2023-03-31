import { MatSnackBar } from '@angular/material/snack-bar';
import { SNACK_BAR_DURATION } from '@biosimulations/config/common';
import { Injectable } from '@angular/core';

@Injectable()
export class ClipboardService {
  public constructor(private snackBar: MatSnackBar) {}

  public copyToClipboard(toCopy: string, snackbarNotification: string): void {
    if (navigator && navigator.clipboard) {
      navigator.clipboard.writeText(toCopy);
    }
    this.snackBar.open(snackbarNotification, undefined, {
      duration: SNACK_BAR_DURATION,
    });
  }
}
