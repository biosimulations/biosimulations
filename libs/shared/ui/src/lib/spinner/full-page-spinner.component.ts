import { Component, Input } from '@angular/core';

@Component({
  selector: 'biosimulations-full-page-spinner',
  templateUrl: './full-page-spinner.component.html',
  styleUrls: ['./full-page-spinner.component.scss'],
})
export class FullPageSpinnerComponent {
  @Input()
  containerHasBreadcrumbs = true;

  @Input()
  containerHasTabs = false;

  @Input()
  containerHasPadding = false;
}
