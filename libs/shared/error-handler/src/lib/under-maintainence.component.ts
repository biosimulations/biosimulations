import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'biosimulations-under-maintainence',
  templateUrl: './under-maintainence.component.html',
  styleUrls: ['./under-maintainence.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnderMaintainenceComponent {
  @Input()
  pageHasBreadCrumbs = false;
}
