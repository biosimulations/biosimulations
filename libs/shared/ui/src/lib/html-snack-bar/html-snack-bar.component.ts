import {
  Component,
  Inject,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

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
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: any,
    public snackBar: MatSnackBar,
  ) {}
}
