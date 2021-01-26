import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'biosimulations-references-view',
  templateUrl: './references-view.component.html',
  styleUrls: ['./references-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReferencesViewComponent {
  @Input()
  list: any;
}
