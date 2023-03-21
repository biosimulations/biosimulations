import { Component, Inject, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import {
  MatLegacySnackBar as MatSnackBar,
  MAT_LEGACY_SNACK_BAR_DATA as MAT_SNACK_BAR_DATA,
} from '@angular/material/legacy-snack-bar';

@Component({
  templateUrl: './html-snack-bar.component.html',
  styleUrls: ['./html-snack-bar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'mat-simple-snackbar',
  },
})
export class HtmlSnackBarComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any, public snackBar: MatSnackBar) {}
}
