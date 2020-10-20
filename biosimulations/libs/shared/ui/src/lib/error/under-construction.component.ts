import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'biosimulations-under-construction',
  templateUrl: './under-construction.component.html',
  styleUrls: ['./under-construction.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnderConstructionComponent {
  @Input()
  pageHasBreadCrumbs = false;
}
