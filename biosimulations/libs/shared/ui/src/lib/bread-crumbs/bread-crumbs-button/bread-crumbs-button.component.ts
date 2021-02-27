import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BiosimulationsIcon } from '@biosimulations/shared/icons';
import { snackBarDuration } from '@biosimulations/config/common';

@Component({
  selector: 'biosimulations-bread-crumbs-button',
  templateUrl: './bread-crumbs-button.component.html',
  styleUrls: ['./bread-crumbs-button.component.scss'],
})
export class BreadCrumbsButtonComponent {
  @Input()
  public label!: string;

  @Input()
  public icon!: BiosimulationsIcon;

  @Input()
  public route?: string | string[];

  @Input()
  public onClick?: (route: string) => string | undefined;

  @Input()
  public hover?: string;

  public constructor(private router: Router, private _snackBar: MatSnackBar) {}
  public clickHandler(): void {
    if (this.onClick) {
      const route = this.router.url;
      const message = this.onClick(route);
      if (message) {
        this._snackBar.open(message, undefined, {
          duration: snackBarDuration,
        });
      }
    }
  }
}
